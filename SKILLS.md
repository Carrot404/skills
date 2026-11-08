# Skills 清单

按仓库分类分组；各组内按名称排序。来源为本地维护副本的 Skill 不自动同步上游。

## 开发工程

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `agent-ssh-cli` | 通过 SSH CLI 管理连接和操作远程服务器 | [agent-ssh-cli](https://github.com/sleepinginsummer/agent-ssh-cli)，本地维护副本 |
| `caveman-review` | 生成精简的代码审查意见 | [Caveman](https://github.com/JuliusBrussee/caveman) |
| `domain-modeling` | 构建领域术语表并记录架构决策 | [Matt Pocock Skills](https://github.com/mattpocock/skills) |
| `grill-with-docs` | 通过深入提问检验设计并记录领域文档 | [Matt Pocock Skills](https://github.com/mattpocock/skills) |
| `html-plan` | 将实现计划编写为交互式 HTML 页面 | [Claude Plugins Community](https://github.com/anthropics/claude-plugins-community/tree/main/html-plan/skills/html-plan) |
| `ponytail` | 通过复用现有实现和最小改动避免过度设计 | [Ponytail](https://github.com/DietrichGebert/ponytail) |
| `ponytail-audit` | 审查整个仓库的质量、风险和可精简内容 | [Ponytail](https://github.com/DietrichGebert/ponytail) |
| `ponytail-review` | 审查代码改动的质量、风险和可精简内容 | [Ponytail](https://github.com/DietrichGebert/ponytail) |
| `surge` | 使用 `surge-cli` 操作和排查 Surge | 仓库内维护 |

## 仓库工作流

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `caveman-commit` | 生成精简的 Conventional Commit 信息 | [Caveman](https://github.com/JuliusBrussee/caveman) |

## 图表可视化

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `drawio-skill` | 创建和编辑可修改的 draw.io 图表 | [drawio-skill](https://github.com/Agents365-ai/drawio-skill/tree/main/skills/drawio-skill) |

## 效率与思考

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `academic-paper-reviewer` | 从多个审稿视角评审学术论文 | [academic-research-skills](https://github.com/Imbad0202/academic-research-skills/tree/main/academic-paper-reviewer) |
| `academic-slides` | 规划和制作学术演示文稿 | [EvoSkills](https://github.com/EvoScientist/EvoSkills/tree/main/skills/academic-slides) |
| `caveman` | 精简回答，同时保留技术信息 | [Caveman](https://github.com/JuliusBrussee/caveman) |
| `find-skills` | 发现和安装 Agent Skills | [Vercel Skills](https://github.com/vercel-labs/skills/tree/main/skills/find-skills) |
| `grill-me` | 通过深入提问检验计划或设计 | [Matt Pocock Skills](https://github.com/mattpocock/skills) |
| `grilling` | 分轮提问，梳理设计决策 | [Matt Pocock Skills](https://github.com/mattpocock/skills) |
| `paper-reading-tutor` | 检索、翻译并深入研读学术论文 | [paper-reading-tutor](https://github.com/LunarXuan/paper-reading-tutor) |
| `paper-rebuttal` | 分析审稿意见并撰写论文回应 | [EvoSkills](https://github.com/EvoScientist/EvoSkills/tree/main/skills/paper-rebuttal) |
| `patent-disclosure` | 挖掘专利点并撰写中国专利交底书 | [patent-disclosure-skill](https://github.com/handsomestWei/patent-disclosure-skill/tree/main/skills/patent-disclosure) |
| `pdf` | 读取、创建、编辑和处理 PDF 文件 | [Anthropic Skills](https://github.com/anthropics/skills/tree/main/skills/pdf) |
| `siyuan-skill` | 通过 CLI 管理思源笔记 | [personal-skill/siyuan-skill](https://github.com/emptylight370/personal-skill/tree/main/siyuan-skill)，本地维护副本 |

## 安装与使用说明

`caveman` 中的 `/caveman ultra` 和 `/caveman wenyan` 别名分别依赖上游的
`ultracave` 和 `megacave`，本仓库不再发布这两个 Skill。

`drawio-skill` 的核心工作流需要 Python 3；原生导出需要 draw.io，自动布局可选用 Graphviz。

`grill-me` 依赖 `grilling`；`grill-with-docs` 依赖 `grilling` 和 `domain-modeling`，安装时需一并指定对应依赖。

Ponytail 的 Skill 以原样同步；其帮助中提到的插件钩子、自动启用、Band 和插件更新功能需要上游插件，单独安装 Skill 不提供这些功能。

`agent-ssh-cli` 需要单独安装 CLI（`npm install -g agent-ssh-cli`）。`siyuan-skill` 需要在 PATH 中提供 `siyuan` 或 `SiYuan-Kernel` 命令。两个 Skill 均在本仓库本地维护，不自动同步上游。

`siyuan-skill` 的上游基准提交为 [`40374d3d440d00db8a8f00562c325cf056e9afea`](https://github.com/emptylight370/personal-skill/tree/40374d3d440d00db8a8f00562c325cf056e9afea/siyuan-skill)。手动更新时可[比较基准提交与上游 main](https://github.com/emptylight370/personal-skill/compare/40374d3d440d00db8a8f00562c325cf056e9afea...main)，合并时保留下述本地修订，并在合并上游更新后修改基准提交；仅修改本地内容不改变上游基准。

本仓库对 [`siyuan-skill`](skills/siyuan-skill/SKILL.md) 的本地修订包括：

- 修正 Markdown 表格、文档路径参数、JSON 输出结构及 SQL 示例，移除非标准的创建来源标记。
- 删除、清理、回滚和覆盖操作先核对范围并检查 dry-run 结果；授权或范围不明确、影响超出请求时，须向用户确认。操作前必须成功创建恢复快照，否则停止执行。
- 按工作空间分别记录实际修改（含失败命令留下的部分修改），在任务结束前为每个修改过的工作空间创建快照并核验结果；只读工作空间跳过。结束快照不替代操作前的恢复快照。

添加方式与维护命令见 [README.md](README.md#添加-skill)。更新外部 Skill 后运行：

```bash
pnpm run groups:generate
pnpm run check
```
