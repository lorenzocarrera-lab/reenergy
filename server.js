const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

app.post('/contact', async (req, res) => {
  const { nome, attivita, tipo, citta, telefono, email, messaggio, colore } = req.body;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0d0d0d;color:#fff;border-radius:12px;overflow:hidden;">
      <div style="background:#111;padding:28px 32px;border-bottom:2px solid #00e5a0;">
        <h1 style="margin:0;font-size:22px;color:#00e5a0;">⚡ RE-ENERGY — Nuova richiesta</h1>
        <p style="margin:6px 0 0;color:#9ca3af;font-size:13px;">Hai ricevuto una nuova richiesta tramite il sito</p>
      </div>
      <div style="padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;width:40%;">Nome e Cognome</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-weight:700;font-size:14px;">${nome || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Nome Attività</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-weight:700;font-size:14px;">${attivita || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Tipo Attività</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;">${tipo || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Città</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;">${citta || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Telefono</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;">${telefono || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Email</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;">${email || '—'}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);color:#6b7280;font-size:13px;">Colore preferito</td><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.07);font-size:14px;">${colore || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top;">Messaggio</td><td style="padding:10px 0;font-size:14px;line-height:1.6;">${messaggio || '—'}</td></tr>
        </table>
      </div>
      <div style="padding:16px 32px;background:#0a0a0a;font-size:12px;color:#4b5563;">
        Inviato dal sito RE-ENERGY
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"RE-ENERGY" <${process.env.GMAIL_USER}>`,
      to: 'lorenzo.carrera.09@icloud.com',
      subject: `⚡ Nuova richiesta RE-ENERGY — ${attivita || nome}`,
      html,
    });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`RE-ENERGY running on port ${PORT}`));
