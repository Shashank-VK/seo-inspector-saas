import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Normalize URL
    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    // Fetch the page
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent": "SEOInspector/1.0 (compatible; SEO analysis tool)",
          Accept: "text/html,application/xhtml+xml",
        },
        redirect: "follow",
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      return NextResponse.json(
        { error: `Could not reach ${targetUrl}. Check the URL and try again.` },
        { status: 422 }
      );
    }
    clearTimeout(timeout);

    if (!response.ok) {
      return NextResponse.json(
        { error: `Server returned ${response.status} ${response.statusText}` },
        { status: 422 }
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // --- Extract SEO Data ---
    const results = {};

    // Title
    const title = $("title").first().text().trim();
    results.title = {
      value: title || null,
      length: title ? title.length : 0,
      status: !title ? "fail" : title.length < 30 ? "warn" : title.length > 60 ? "warn" : "pass",
      message: !title
        ? "Missing title tag"
        : title.length < 30
        ? `Too short (${title.length} chars, aim for 30-60)`
        : title.length > 60
        ? `Too long (${title.length} chars, aim for 30-60)`
        : `Good length (${title.length} chars)`,
    };

    // Meta Description
    const metaDesc =
      $('meta[name="description"]').attr("content")?.trim() || null;
    results.metaDescription = {
      value: metaDesc,
      length: metaDesc ? metaDesc.length : 0,
      status: !metaDesc
        ? "fail"
        : metaDesc.length < 120
        ? "warn"
        : metaDesc.length > 160
        ? "warn"
        : "pass",
      message: !metaDesc
        ? "Missing meta description"
        : metaDesc.length < 120
        ? `Too short (${metaDesc.length} chars, aim for 120-160)`
        : metaDesc.length > 160
        ? `Too long (${metaDesc.length} chars, aim for 120-160)`
        : `Good length (${metaDesc.length} chars)`,
    };

    // Open Graph
    const ogTags = {};
    $("meta[property^='og:']").each((_, el) => {
      const prop = $(el).attr("property");
      const content = $(el).attr("content");
      if (prop && content) ogTags[prop] = content;
    });
    results.openGraph = {
      tags: ogTags,
      count: Object.keys(ogTags).length,
      status: Object.keys(ogTags).length === 0 ? "fail" : Object.keys(ogTags).length < 4 ? "warn" : "pass",
      message:
        Object.keys(ogTags).length === 0
          ? "No Open Graph tags found"
          : Object.keys(ogTags).length < 4
          ? `Only ${Object.keys(ogTags).length} OG tags (recommend og:title, og:description, og:image, og:url)`
          : `${Object.keys(ogTags).length} OG tags found`,
    };

    // Twitter Card
    const twitterTags = {};
    $("meta[name^='twitter:'], meta[property^='twitter:']").each((_, el) => {
      const name = $(el).attr("name") || $(el).attr("property");
      const content = $(el).attr("content");
      if (name && content) twitterTags[name] = content;
    });
    results.twitterCard = {
      tags: twitterTags,
      count: Object.keys(twitterTags).length,
      status: Object.keys(twitterTags).length === 0 ? "warn" : "pass",
      message:
        Object.keys(twitterTags).length === 0
          ? "No Twitter Card tags found"
          : `${Object.keys(twitterTags).length} Twitter Card tags found`,
    };

    // Headings
    const headings = [];
    $("h1, h2, h3, h4, h5, h6").each((_, el) => {
      const tag = el.tagName.toLowerCase();
      const text = $(el).text().trim().substring(0, 120);
      if (text) headings.push({ tag, text });
    });

    const h1Count = headings.filter((h) => h.tag === "h1").length;
    results.headings = {
      list: headings.slice(0, 30), // cap at 30
      totalCount: headings.length,
      h1Count,
      status: h1Count === 0 ? "fail" : h1Count > 1 ? "warn" : "pass",
      message:
        h1Count === 0
          ? "No H1 tag found"
          : h1Count > 1
          ? `${h1Count} H1 tags found (should be exactly 1)`
          : "Single H1 tag — good",
    };

    // Images
    const images = [];
    $("img").each((_, el) => {
      const src = $(el).attr("src") || "";
      const alt = $(el).attr("alt");
      images.push({
        src: src.substring(0, 100),
        hasAlt: alt !== undefined && alt !== null,
        altText: alt ? alt.substring(0, 80) : null,
      });
    });

    const imagesWithoutAlt = images.filter((img) => !img.hasAlt).length;
    results.images = {
      list: images.slice(0, 20),
      totalCount: images.length,
      missingAlt: imagesWithoutAlt,
      status: images.length === 0 ? "info" : imagesWithoutAlt === 0 ? "pass" : imagesWithoutAlt > 3 ? "fail" : "warn",
      message:
        images.length === 0
          ? "No images found"
          : imagesWithoutAlt === 0
          ? `All ${images.length} images have alt text`
          : `${imagesWithoutAlt} of ${images.length} images missing alt text`,
    };

    // Canonical
    const canonical = $('link[rel="canonical"]').attr("href") || null;
    results.canonical = {
      value: canonical,
      status: canonical ? "pass" : "warn",
      message: canonical ? `Canonical URL: ${canonical}` : "No canonical tag found",
    };

    // Robots meta
    const robotsMeta = $('meta[name="robots"]').attr("content") || null;
    results.robots = {
      value: robotsMeta,
      status: robotsMeta && robotsMeta.includes("noindex") ? "warn" : "pass",
      message: !robotsMeta
        ? "No robots meta tag (default: index, follow)"
        : robotsMeta.includes("noindex")
        ? `Page is set to noindex: ${robotsMeta}`
        : `Robots: ${robotsMeta}`,
    };

    // Viewport
    const viewport = $('meta[name="viewport"]').attr("content") || null;
    results.viewport = {
      value: viewport,
      status: viewport ? "pass" : "fail",
      message: viewport ? "Viewport meta tag present" : "Missing viewport meta tag (bad for mobile)",
    };

    // Language
    const lang = $("html").attr("lang") || null;
    results.language = {
      value: lang,
      status: lang ? "pass" : "warn",
      message: lang ? `Language: ${lang}` : "No lang attribute on <html>",
    };

    // Charset
    const charset = $('meta[charset]').attr("charset") || $('meta[http-equiv="Content-Type"]').attr("content") || null;
    results.charset = {
      value: charset,
      status: charset ? "pass" : "warn",
      message: charset ? `Charset: ${charset}` : "No charset declaration found",
    };

    // Favicon
    const favicon = $('link[rel="icon"], link[rel="shortcut icon"]').attr("href") || null;
    results.favicon = {
      value: favicon,
      status: favicon ? "pass" : "warn",
      message: favicon ? "Favicon found" : "No favicon link tag found",
    };

    // Calculate overall score
    const allStatuses = Object.values(results).map((r) => r.status);
    const passCount = allStatuses.filter((s) => s === "pass").length;
    const totalChecks = allStatuses.filter((s) => s !== "info").length;
    const score = totalChecks > 0 ? Math.round((passCount / totalChecks) * 100) : 0;

    return NextResponse.json({
      url: targetUrl,
      scannedAt: new Date().toISOString(),
      score,
      results,
    });
  } catch (error) {
    console.error("Scan error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while scanning." },
      { status: 500 }
    );
  }
}
