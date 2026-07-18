export default function sitemap() {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rakesh-rk.dev';

    const projects = [
        'kalp-ai', 'sentinelhunt', 'ghostnet', 'forenscope',
        'ai4kali', 'portknock', 'stockerx', 'campus-network', 'ipchanger',
    ];

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 1,
        },
        {
            url: `${baseUrl}/ctf`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        },
        ...projects.map(slug => ({
            url: `${baseUrl}/projects/${slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        })),
    ];
}

