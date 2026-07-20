
import * as cheerio from 'cheerio';

// Comprehensive list of common non-HTML downloadable file extensions
  const blockedExtensions = [
    // Documents
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'rtf', 'txt', 'csv',
    // Archives/Compressed
    'zip', 'rar', '7z', 'tar', 'gz', 'dmg', 'iso',
    // Executables/Installers
    'exe', 'msi', 'apk', 'app', 'deb', 'rpm', 'sh', 'bat',
    // Media (Audio/Video/Images)
    'mp3', 'mp4', 'mkv', 'avi', 'mov', 'wav', 'flac', 'jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'ico'
  ];

export async function extractWebsiteMetadata(url: string) {
    try {
        const baseURL = new URL(url).origin;
    
        const pages: Array<{ title: string; url: string, description: string }> = [];
    
        let mainTitle = "";
        let mainDescription = "";

        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml",
            },
        });

        const html = await response.text();

        const $ = cheerio.load(html);

        mainTitle = $('title').text().trim() || new URL(url).hostname;

        mainDescription = $('meta[name="description"]').attr('content')?.trim() || '';

        $('a[href]').each(((_, element) => {
            const href = $(element).attr('href');
            if(!href) return;

            try {
                const absoluteURL = new URL(href, baseURL).href;
                if(absoluteURL.startsWith(baseURL) && !absoluteURL.includes('#') && !blockedExtensions.some(ext => absoluteURL.endsWith(`.${ext}`))) {
                    const title = $(element).text().trim() || "View Page";
                    if(pages.length < 30 && !pages.some(p => p.url === absoluteURL)) {
                        pages.push({ title, url: absoluteURL, description: "" });
                    }
                }
            } catch (error) {
                
            }
        }))

        const isSinglePageApp = pages.length <= 1;

        if(isSinglePageApp) {
            $('a[href]').each((_, element) => {
                const href = $(element).attr('href');
                if(!href) return;
                try {
                    const absoluteURL = new URL(href, baseURL).href;
                    if(absoluteURL.startsWith(baseURL) && absoluteURL.includes('#') && !blockedExtensions.some(ext => absoluteURL.endsWith(`.${ext}`))) {
                        const title = $(element).text().trim() || "View Page";
                        if(pages.length < 30 && !pages.some(p => p.url === absoluteURL)) {
                            pages.push({ title, url: absoluteURL, description: "" });
                        }
                    }
                } catch (error) {
                    
                }
            })
        }
        
    try {
        const sitemapRes = await fetch(`${baseURL}/sitemap.xml`);
        if (sitemapRes.ok) {
                const sitemapXml = await sitemapRes.text();
                const $xml = cheerio.load(sitemapXml, { xmlMode: true });
                $xml('loc').each((_, loc) => {
                const url = $(loc).text().trim();
                if (pages.length < 40 && !pages.some(p => p.url === url)) {
                    pages.push({ title: 'Page', url, description: '' });
                }
            });
        }
    } catch (_) {}

        return { mainTitle, mainDescription, pages };
        
    } catch (error) {
        throw new Error(`Failed to scrape website: ${url}`);
    }
}