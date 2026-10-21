const express = require('express');
const crypto = require('crypto');
const { col } = require('../lib/db');
const { auth, users } = require('../lib/auth');

const router = express.Router();
const profiles = col('labour_profiles');
const requests = col('labour_requests');

const SKILLS = ['Ploughing', 'Sowing', 'Weeding', 'Fertilizer spreading', 'Pesticide spraying', 'Irrigation / sprinkling', 'Harvesting', 'Plucking (fruit / tea / cotton)', 'Transplanting', 'Tractor driving', 'Threshing', 'Loading & unloading', 'Pruning', 'Livestock care', 'Orchard work', 'Drone spraying'];
const clean = (s, n) => String(s || '').trim().slice(0, n);

function ownerOf(p) { return users.rows.find((u) => u.id === p.userId); }
function view(p, viewerId, phoneVisible) {
  const u = ownerOf(p) || {};
  return {
    id: p.id, userId: p.userId, name: u.name || 'Worker', village: u.village || '', state: p.state || u.state,
    district: p.district, headline: p.headline, description: p.description, conditions: p.conditions,
    skills: p.skills, rateType: p.rateType, rate: p.rate, experience: p.experience, travelKm: p.travelKm,
    available: p.available, createdAt: p.createdAt, updatedAt: p.updatedAt, mine: p.userId === viewerId,
    phone: phoneVisible || p.userId === viewerId ? u.phone : undefined,
  };
}
const hasAccess = (viewerId, workerUserId) =>
  requests.rows.some((r) => r.fromId === viewerId && r.toId === workerUserId && r.status === 'accepted');

router.get('/labour/skills', auth, (_req, res) => res.json({ skills: SKILLS }));

router.get('/labour/me', auth, (req, res) => {
  const p = profiles.rows.find((x) => x.userId === req.user.id);
  res.json({ profile: p ? view(p, req.user.id) : null });
});

router.put('/labour/me', auth, (req, res) => {
  const b = req.body || {};
  const skills = [...new Set((Array.isArray(b.skills) ? b.skills : []).map((s) => clean(s, 40)).filter(Boolean))].slice(0, 12);
  const rate = Number(b.rate);
  if (!skills.length) return res.status(400).json({ error: 'Pick at least one skill.' });
  if (!['hour', 'day'].includes(b.rateType)) return res.status(400).json({ error: 'Choose hourly or daily pay.' });
  if (!(rate > 0) || rate > 100000) return res.status(400).json({ error: 'Enter a valid pay amount.' });
  const description = clean(b.description, 800);
  if (description.length < 10) return res.status(400).json({ error: 'Write a short description about yourself (10+ characters).' });

  let p = profiles.rows.find((x) => x.userId === req.user.id);
  const now = new Date().toISOString();
  if (!p) { p = { id: crypto.randomUUID(), userId: req.user.id, createdAt: now }; profiles.rows.push(p); }
  Object.assign(p, {
    headline: clean(b.headline, 80), description, conditions: clean(b.conditions, 600), skills,
    rateType: b.rateType, rate, state: clean(b.state, 40) || req.user.state, district: clean(b.district, 60),
    experience: Math.max(0, Math.min(60, Number(b.experience) || 0)), travelKm: Math.max(0, Math.min(500, Number(b.travelKm) || 0)),
    available: b.available !== false, updatedAt: now,
  });
  profiles.save();
  res.json({ profile: view(p, req.user.id) });
});

router.post('/labour/me/availability', auth, (req, res) => {
  const p = profiles.rows.find((x) => x.userId === req.user.id);
  if (!p) return res.status(404).json({ error: 'Create your worker profile first.' });
  p.available = !!(req.body || {}).available;
  profiles.save();
  res.json({ profile: view(p, req.user.id) });
});

router.delete('/labour/me', auth, (req, res) => {
  const i = profiles.rows.findIndex((x) => x.userId === req.user.id);
  if (i >= 0) { profiles.rows.splice(i, 1); profiles.save(); }
  res.json({ ok: true });
});

router.get('/labour/workers', auth, (req, res) => {
  const { skill, state, district, q, maxRate, rateType, sort } = req.query;
  let list = profiles.rows.filter((p) => p.available && p.userId !== req.user.id);
  if (skill) list = list.filter((p) => p.skills.includes(skill));
  if (state) list = list.filter((p) => p.state === state);
  if (district) list = list.filter((p) => (p.district || '').toLowerCase().includes(String(district).toLowerCase()));
  if (rateType) list = list.filter((p) => p.rateType === rateType);
  if (maxRate && Number(maxRate) > 0) list = list.filter((p) => p.rate <= Number(maxRate));
  if (q) {
    const t = String(q).toLowerCase();
    list = list.filter((p) => [p.headline, p.description, p.conditions, ownerOf(p)?.name, p.skills.join(' ')].join(' ').toLowerCase().includes(t));
  }
  const near = (p) => (district && (p.district || '').toLowerCase() === String(district).toLowerCase() ? 2 : 0) + (p.state === req.user.state ? 1 : 0);
  const by = { near: (a, b) => near(b) - near(a) || b.updatedAt.localeCompare(a.updatedAt), cheap: (a, b) => a.rate - b.rate, exp: (a, b) => b.experience - a.experience, new: (a, b) => b.updatedAt.localeCompare(a.updatedAt) };
  list.sort(by[sort] || by.near);
  res.json({ workers: list.slice(0, 100).map((p) => ({ ...view(p, req.user.id, hasAccess(req.user.id, p.userId)), nearScore: near(p) })) });
});

router.get('/labour/workers/:id', auth, (req, res) => {
  const p = profiles.rows.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Worker not found.' });
  const mine = requests.rows.find((r) => r.fromId === req.user.id && r.toId === p.userId && r.status === 'pending');
  res.json({ worker: view(p, req.user.id, hasAccess(req.user.id, p.userId)), pendingRequest: !!mine });
});

router.post('/labour/workers/:id/requests', auth, (req, res) => {
  const p = profiles.rows.find((x) => x.id === req.params.id);
  if (!p) return res.status(404).json({ error: 'Worker not found.' });
  if (p.userId === req.user.id) return res.status(400).json({ error: "You can't hire yourself." });
  const b = req.body || {};
  const message = clean(b.message, 600);
  const job = clean(b.job, 60);
  if (!job) return res.status(400).json({ error: 'Tell the worker what work you need.' });
  if (message.length < 5) return res.status(400).json({ error: 'Add a short message for the worker.' });
  if (requests.rows.some((r) => r.fromId === req.user.id && r.toId === p.userId && r.status === 'pending')) {
    return res.status(409).json({ error: 'You already have a pending request with this worker.' });
  }
  const r = {
    id: crypto.randomUUID(), fromId: req.user.id, toId: p.userId, profileId: p.id, job, message,
    startDate: clean(b.startDate, 10), duration: clean(b.duration, 40), location: clean(b.location, 100),
    offer: Number(b.offer) > 0 ? Number(b.offer) : null, status: 'pending', createdAt: new Date().toISOString(),
  };
  requests.rows.push(r);
  requests.save();
  res.status(201).json({ ok: true });
});

router.get('/labour/requests', auth, (req, res) => {
  const box = req.query.box === 'out' ? 'out' : 'in';
  const rows = requests.rows.filter((r) => (box === 'in' ? r.toId : r.fromId) === req.user.id)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 100);
  res.json({
    requests: rows.map((r) => {
      const other = users.rows.find((u) => u.id === (box === 'in' ? r.fromId : r.toId)) || {};
      const profile = profiles.rows.find((x) => x.id === r.profileId);
      return {
        ...{ id: r.id, job: r.job, message: r.message, startDate: r.startDate, duration: r.duration, location: r.location, offer: r.offer, status: r.status, createdAt: r.createdAt },
        otherName: other.name, otherVillage: other.village, otherState: other.state,
        rateType: profile?.rateType, rate: profile?.rate,
        otherPhone: r.status === 'accepted' ? other.phone : undefined,
      };
    }),
  });
});

router.post('/labour/requests/:id/respond', auth, (req, res) => {
  const r = requests.rows.find((x) => x.id === req.params.id && x.toId === req.user.id);
  if (!r) return res.status(404).json({ error: 'Request not found.' });
  if (r.status !== 'pending') return res.status(400).json({ error: 'Already answered.' });
  const action = (req.body || {}).action;
  if (!['accept', 'decline'].includes(action)) return res.status(400).json({ error: 'Invalid action.' });
  r.status = action === 'accept' ? 'accepted' : 'declined';
  r.respondedAt = new Date().toISOString();
  requests.save();
  res.json({ ok: true });
});

module.exports = { router };
