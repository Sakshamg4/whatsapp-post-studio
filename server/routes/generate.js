const express = require('express');
const axios = require('axios');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Mistral } = require('@mistralai/mistralai');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const {
      rawContent,
      language = 'English',
      blogTitle = '',
      blogUrl = '',
      provider = 'groq'
    } = req.body;

    let processBlogUrl = blogUrl;
    if (processBlogUrl && !processBlogUrl.includes('premiumtoolshub.in')) {
      processBlogUrl = `https://www.premiumtoolshub.in${processBlogUrl.startsWith('/') ? '' : '/'}${processBlogUrl.replace(/^https?:\/\/[^\/]+\/?/, '')}`;
    }

    const systemPrompt = `You are a WhatsApp marketing post formatter for a premium digital tools reseller.
Your job is to take any raw product post content and reformat it into the exact output format provided.
Extract the product name, features, activation info from the raw content.
Do not add extra sections. Do not explain anything.
Return ONLY the formatted post text. No markdown code fences.`;

    const userPrompt = `Reformat the following raw product post into the exact output format below.

RAW CONTENT:
"""
${rawContent}
"""

Language to write in: ${language}

Use this EXACT output format — do not change any footer links:

[PRODUCT EMOJI] [Product Name extracted from content] – [Plan/Duration extracted from content]
[One catchy benefit-focused description line, max 15 words]

💡 What You Get:
✅ [feature extracted or rewritten, max 10 words]
✅ [feature extracted or rewritten, max 10 words]
✅ [feature extracted or rewritten, max 10 words]
✅ [feature extracted or rewritten, max 10 words]
✅ [feature extracted or rewritten, max 10 words]

⚙️ Activation Method:
🔐 [activation method extracted from content]
🛡️ Safe & verified activation process

${blogTitle && processBlogUrl 
  ? `📖 Related Blog: ${blogTitle} → ${processBlogUrl}` 
  : `📖 Related Blog: [Product Name] – Complete Guide → https://www.premiumtoolshub.in/blog/`}

⏳ Limited slots available. DM now to activate.
📲 DM: +91 90291 51181
🌐 Website: https://www.premiumtoolshub.in
👥 Community & Support: https://chat.whatsapp.com/HV2nHlZXjBk2bbFgcR4sHQ

Rules:
- Extract product name, plan, features, activation from the raw content
- Keep each ✅ line under 10 words
- Keep description under 15 words
- Do NOT change or remove the footer links
- Do NOT add any extra sections
- Return ONLY the post text`;

    let generatedMessage = '';

    if (provider === 'claude') {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-sonnet-4-20250514',
          max_tokens: 700,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
        },
        {
          headers: {
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      );
      generatedMessage = response.data.content[0].text.trim();
    } else if (provider === 'gemini') {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      generatedMessage = response.text().trim();
    } else if (provider === 'mistral') {
      const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
      const response = await client.chat.complete({
        model: 'mistral-large-latest',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      });
      generatedMessage = response.choices[0].message.content.trim();
    } else {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama-3.3-70b-versatile',
          max_tokens: 700,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        },
        { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } }
      );
      generatedMessage = response.data.choices[0].message.content.trim();
    }

    // Strip any markdown code fences the AI might have added
    generatedMessage = generatedMessage.replace(/^```(?:markdown)?\n?/i, '').replace(/\n?```$/i, '').trim();

    // Backend Enforcement: Footer is always hardcoded
    const exactFooter = `📲 DM: +91 90291 51181\n🌐 Website: https://www.premiumtoolshub.in\n👥 Community & Support: https://chat.whatsapp.com/HV2nHlZXjBk2bbFgcR4sHQ`;
    
    const dmIndex = generatedMessage.indexOf('📲 DM:');
    if (dmIndex !== -1) {
      generatedMessage = generatedMessage.substring(0, dmIndex).trim() + '\n' + exactFooter;
    } else {
      generatedMessage = generatedMessage.trim() + '\n' + exactFooter;
    }

    res.json({ message: generatedMessage });
  } catch (error) {
    console.error('Generation Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate post' });
  }
});

module.exports = router;
