/** @type {import('./$types').RequestHandler} */
import { error } from '@sveltejs/kit';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET({ url }) {
    try {
        // Read PDF from static folder
        const pdfPath = join(process.cwd(), 'static', 'robotics_resume.pdf');
        const pdf = readFileSync(pdfPath);

        return new Response(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="robotics_resume.pdf"'
            }
        });
    } catch (err) {
        throw error(404, 'PDF not found');
    }
}

// Alternative: Serve PDF with download option
export async function POST({ request }) {
    try {
        const { filename = 'robotics_resume.pdf' } = await request.json();

        const pdfPath = join(process.cwd(), 'static', filename);
        const pdf = readFileSync(pdfPath);

        return new Response(pdf, {
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });
    } catch (err) {
        throw error(404, 'PDF not found');
    }
}