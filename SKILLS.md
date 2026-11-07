# Skills 清单

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `caveman` | 精简回答，同时保留技术信息 | [Caveman](https://github.com/JuliusBrussee/caveman) |
| `caveman-commit` | 生成精简的 Conventional Commit 信息 | 同上 |
| `caveman-review` | 生成精简的代码审查意见 | 同上 |
| `ultracave` | 以极简片语压缩回答 | 同上 |
| `megacave` | 以文言文精简回答 | 同上 |
| `surge` | 使用 `surge-cli` 操作和排查 Surge | 仓库内维护 |
| `agent-ssh-cli` | 通过 SSH CLI 管理连接和操作远程服务器 | [agent-ssh-cli](https://github.com/sleepinginsummer/agent-ssh-cli)，本地维护副本 |
| `siyuan-skill` | 通过 CLI 管理思源笔记 | [personal-skill/siyuan-skill](https://github.com/emptylight370/personal-skill/tree/main/siyuan-skill)，本地维护副本 |

`caveman` 中的 `/caveman ultra` 和 `/caveman wenyan` 别名分别依赖
`ultracave` 和 `megacave`。如需使用这两个别名，安装时请一并指定：

```bash
npx skills add Carrot404/skills --skill caveman ultracave megacave
```

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
