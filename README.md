# 🔍 SEO & SERP Inspector — Technical Diagnostic Suite

A high-performance, real-time technical SEO auditing tool and Google SERP simulator built with **Next.js 16 (App Router)**, **Cheerio**, and **pure modern CSS**.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT%20%2F%20Commercial-blue?style=flat-square)](LICENSE)
[![Zero-Bloat](https://img.shields.io/badge/Dependencies-Lightweight-emerald?style=flat-square)](package.json)

---

## ⚡ Features

- 🎯 **Real-Time Technical Auditing** — Serverless endpoint fetches and analyzes HTML in <500ms using Cheerio.
- 📱 **100% Google SERP Simulator** — Real-time desktop preview of how search engines display your Title and Meta Description with exact pixel and character truncation boundaries.
- 🌐 **OpenGraph & Twitter Card Graph Validation** — Checks presence and completeness of social metadata tags (`og:title`, `og:image`, `twitter:card`).
- 🏗️ **Semantic Heading Hierarchy** — Audits single H1 presence and logical heading progression.
- 🤖 **Crawler Directives & Indexability** — Inspects Canonical tags, Robots meta directives, viewport tags, charset, and lang attributes.
- 📊 **Dynamic Technical Health Index** — Instant 0–100 score dial with granular Pass / Warning / Failure counts.
- 🎨 **Obsidian Hardware Aesthetic** — Built with `Cabinet Grotesk`, `JetBrains Mono`, and `Plus Jakarta Sans`.

---

## 🚀 Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/Shashank-VK/seo-inspector-saas.git
cd seo-inspector-saas
npm install
```

### 2. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to start inspecting.

---

## 🔌 API Endpoint

You can use the built-in scan route as a headless microservice:

```bash
POST /api/scan
Content-Type: application/json

{
  "url": "https://stripe.com"
}
```

### Example Response:
```json
{
  "url": "https://stripe.com",
  "score": 92,
  "results": {
    "title": { "value": "Financial Infrastructure for the Internet", "status": "pass" },
    "metaDescription": { "length": 142, "status": "pass" },
    "openGraph": { "count": 6, "status": "pass" }
  }
}
```

---

## 💳 Commercial Licensing & Bespoke Setup

If you wish to integrate SEO Inspector into your SaaS, agency workflow, or client portal:

### 🇮🇳 Domestic UPI (India):
- **Personal / Indie License**: ₹999
- **Commercial / Enterprise API**: ₹2,499
- **UPI ID**: `shashankkaramudi@ibl`
- **Instant Activation**: Send screenshot to WhatsApp: [**+91 9980955236**](https://wa.me/919980955236?text=Hi%20Shashank,%20I%20completed%20the%20UPI%20payment%20for%20SEO%20Inspector%20Commercial%20License)

### 🌐 Global (On-Chain Crypto):
- **Personal**: $29 USDC / USDT
- **Commercial / Enterprise**: $79 USDC / USDT
- **EVM Address (Base / Arbitrum / Polygon / Ethereum)**:
  `0x49e03383285eEef3927E12D88c1227f059BbD42d`
- **Proof / Receipt**: Confirm tx hash on WhatsApp: [**+91 9980955236**](https://wa.me/919980955236?text=Hi%20Shashank,%20I%20sent%20crypto%20for%20SEO%20Inspector%20License)

---

## 👨‍💻 Author

Engineered by **Shashank Karamudi**.  
WhatsApp: [**+91 9980955236**](https://wa.me/919980955236) | Email: `shashankvkaramudi51@gmail.com`
