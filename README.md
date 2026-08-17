# 迟灯杂货铺

一个零依赖的纯 JavaScript 叙事经营小游戏。每天接待一位带着故事的客人，选择出售、制作物品，或拒绝交易。进度保存在浏览器 `localStorage` 中。

访客内容集中在 `data/visitors.js`：新增或调整访客时，可配置类别、章节、故事、需求、报酬，以及随好感解锁的星期、月份、季节和月相来访条件。

材料分类与商品配方集中在 `data/items.js`。当前包含 18 种材料和 24 件商品，每份配方都使用材料名称与所需数量进行配置。

每日天气权重和环境掉落规则也位于 `data/items.js`。每天根据季节、天气和月相生成 1～3 种材料；成品配方只有在客人首次提出需求后才会被发现。

## 本地运行

普通试玩可以直接打开 `index.html`，或启动任意静态文件服务器。

需要从 AI 实验室把最佳策略同步到 GitHub Pages 时，请在项目目录运行：

```bash
python3 local_server.py
```

然后打开 `http://localhost:8000/#ai-lab`。点击“写入线上策略文件”只会更新 `ai-policy-defaults.js`，不会暂存、提交或推送。你可以在 IDE 的 Git 变更中检查权重差异，再自行提交并推送；GitHub Pages 部署完成后，线上自动玩家会按对应游戏模式使用新策略。该接口只监听本机地址，不会在线上开放。

## 发布到 GitHub Pages

在仓库的 **Settings → Pages** 中，将 **Source** 设为 **Deploy from a branch**，选择 `main` 分支和 `/ (root)` 目录即可。
