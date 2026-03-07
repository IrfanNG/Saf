import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Saf',
        short_name: 'Saf',
        description: 'Your daily companion for Ramadhan and beyond.',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#064e3b',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
    };
}
