    const owner = "leekblog";
    const repo = "leekblog.github.io";
    const dirPath = "";
    const token = process.env.GITHUB_TOKEN; // 如果仓库是私有的

    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}`;

    fetch(url, {
        headers: {
            Authorization: `token ${token}`, // 可选：仅在私有仓库需要
        },
    })
    .then((response) => response.json())
    .then((data) => {
        if (Array.isArray(data)) {
            data.forEach(item => {
                console.log(`${item.type}: ${item.name} (${item.path})`);
            });
        } else {
            console.error("无法获取文件列表:", data);
        }
    })
    .catch((error) => console.error("请求失败:", error));
  
