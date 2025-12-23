import { Marked } from 'marked';
import markedShiki from 'marked-shiki';
import markedKatex from 'marked-katex-extension';
import matter from 'gray-matter';
import { createHighlighter } from 'shiki';
import {
    transformerNotationDiff,
    transformerNotationHighlight,
    transformerNotationWordHighlight,
    transformerNotationFocus,
    transformerNotationErrorLevel,
    transformerMetaHighlight,
    transformerMetaWordHighlight
} from '@shikijs/transformers';
import posts from '$lib/Posts.js';
import { error } from '@sveltejs/kit';

import GPUICP from '$lib/content/blog/gpu-icp.md?raw';
import LidarOdometry from '$lib/content/blog/lidar-odometry.md?raw';
import QuadrapedTraining from '$lib/content/blog/quadraped-training.md?raw';
import SLAM from '$lib/content/blog/slam-challenge.md?raw';


const modules = {
    'gpu-icp': GPUICP,
    'lidar-odometry': LidarOdometry,
    'quadraped-training': QuadrapedTraining,
    'slam-challenge': SLAM
}

export async function load({ params }) {
    const { slug } = params;

    // Find metadata from Posts.js
    const postMetadata = posts.find((p) => p.slug === slug);
    if (!postMetadata) {
        throw error(404, { message: `Post not found: ${slug}` });
    }

    const rawContent = modules[slug];

    if (!rawContent) {
        throw error(404, { message: `Content not found for post: ${slug}` });
    }

    // Parse frontmatter
    const { data: frontmatter, content: markdownBody } = matter(rawContent);

    // Create highlighter for code blocks
    const highlighter = await createHighlighter({
        langs: ['c', 'cpp', 'python', 'javascript', 'typescript', 'bash', 'json', 'yaml', 'html', 'css'],
        themes: ['nord']
    });

    // Render markdown to HTML
    const rendered = await new Marked()
        .use(
            markedShiki({
                highlight(code, lang, props) {
                    return highlighter.codeToHtml(code, {
                        lang: lang || 'text',
                        theme: 'nord',
                        meta: { __raw: props.join(' ') },
                        transformers: [
                            transformerNotationDiff({ matchAlgorithm: 'v3' }),
                            transformerNotationHighlight({ matchAlgorithm: 'v3' }),
                            transformerNotationWordHighlight({ matchAlgorithm: 'v3' }),
                            transformerNotationFocus({ matchAlgorithm: 'v3' }),
                            transformerNotationErrorLevel({ matchAlgorithm: 'v3' }),
                            transformerMetaHighlight(),
                            transformerMetaWordHighlight()
                        ]
                    });
                }
            })
        )
        .use(markedKatex({ throwOnError: false }))
        .parse(markdownBody);

    // Merge metadata and frontmatter
    const post = {
        ...postMetadata,
        ...frontmatter
    };

    return {
        post,
        content: rendered
    };
}
