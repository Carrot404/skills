# Skills 清单

| Skill | 用途 | 来源 |
| --- | --- | --- |
| `caveman` | 精简回答，同时保留技术信息 | [Caveman](https://github.com/JuliusBrussee/caveman) |
| `caveman-commit` | 生成精简的 Conventional Commit 信息 | 同上 |
| `caveman-review` | 生成精简的代码审查意见 | 同上 |

`caveman` 中的 `/caveman ultra` 和 `/caveman wenyan` 别名分别依赖上游
`ultracave` 和 `megacave` Skill；本仓库未发布这两个可选 Skill。

添加方式与维护命令见 [README.md](README.md#添加-skill)。更新外部 Skill 后运行：

```bash
pnpm run groups:generate
pnpm run check
```
