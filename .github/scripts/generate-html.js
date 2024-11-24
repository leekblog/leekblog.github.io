const fs = require('fs-extra');
const path = require('path');
const markdownit = require('markdown-it');
const md = new markdownit();

const postsDir = path.join(__dirname, '..', '..', 'posts');
const outputDir = path.join(__dirname, '..', '..', 'pages');

fs.emptyDirSync(outputDir); // 清空输出目录

async function main() {
    const posts = await fs.readdir(postsDir);
    const sortedPosts = posts
        .map(post => ({
            name: post,
            time: fs.statSync(path.join(postsDir, post)).birthtime
        }))
        .sort((a, b) => b.time - a.time);

    const postData = sortedPosts.map(postItem => {
        const postPath = path.join(postsDir, postItem.name);
        const content = fs.readFileSync(path.join(postPath, 'index.md'), 'utf8');
        let keywords = 'Default Keywords';
        let description = 'Default Description';

        try {
            keywords = fs.readFileSync(path.join(postPath, 'keywords.txt'), 'utf8').trim();
        } catch (e) {}

        try {
            description = fs.readFileSync(path.join(postPath, 'description.txt'), 'utf8').trim();
        } catch (e) {}

        const year = postItem.time.getFullYear();
        const monthDay = `${postItem.time.getFullYear()}/${String(postItem.time.getMonth() + 1).padStart(2, '0')}/${String(postItem.time.getDate()).padStart(2, '0')}`;

        return {
            title: postItem.name,
            year,
            monthDay,
            htmlContent: md.render(content),
            keywords,
            description
        };
    });

    const links = [];
    postData.forEach(post => {
        const filePath = path.join(outputDir, `${post.title}.html`);
        const htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="keywords" content="${post.keywords}">
                <meta name="description" content="${post.description}">
                <title>${post.title}</title>
            </head>
            <body>
                <h1>${post.title}</h1>
                <span>${post.year} ${post.monthDay}</span>
                <main>${post.htmlContent}</main>
            </body>
            </html>
        `;

        fs.writeFileSync(filePath, htmlContent, 'utf8');
        links.push(`<a href='./${path.basename(filePath)}'>[${post.title}] [${post.year} ${post.monthDay}]</a>`);
    });

    const pageSize = 10;
    const totalPages = Math.ceil(links.length / pageSize);

    for (let i = 0; i < totalPages; i++) {
        const start = i * pageSize;
        const end = start + pageSize;
        const pageLinks = links.slice(start, end);

        let prevLink = '';
        let nextLink = '';

        if (i > 0) {
            prevLink = `<a href="index${i - 1}.html">Previous</a>`;
        }

        if (i < totalPages - 1) {
            nextLink = `<a href="index${i + 1}.html">Next</a>`;
        }

        const indexHtmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Index Page ${i}</title>
            </head>
            <body>
                ${prevLink}
                <ul>${pageLinks.join('')}</ul>
                ${nextLink}
            </body>
            </html>
        `;

        const indexFileName = i === 0 ? 'index.html' : `index${i}.html`;
        fs.writeFileSync(path.join(outputDir, indexFileName), indexHtmlContent, 'utf8');
    }
}

main().catch(console.error);