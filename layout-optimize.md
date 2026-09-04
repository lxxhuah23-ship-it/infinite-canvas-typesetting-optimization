# Infinite Canvas「排版优化」第三方插件

## 安装

1. 将 `layout-optimize.js` 放到一个能被画布访问的静态 URL（例如你自己的站点、GitHub Pages 或 Nginx）。
2. 打开画布左上角菜单 →「节点插件」→「第三方插件」。
3. 粘贴该 JS 文件的 HTTPS URL，点击「安装」。
4. 多选 2 个或以上部件，右键点击「排版优化」。

## 排列规则

- 4 个部件：2×2
- 9 个部件：3×3
- 6 个部件：3 列 × 2 行
- 其他数量自动取接近方阵的列数

插件按选区左上角定位，保留部件尺寸，自动加入间距，并通过画布 `update_node` 操作写入，因此可使用 Ctrl/Cmd+Z 撤销。

## 重要兼容说明

Infinite Canvas v0.17 的原生第三方插件契约目前只公开节点、工具栏和 `setup(app)`，没有全局右键菜单扩展接口。要让“右键 → 排版优化”出现，需要把本目录中的宿主兼容补丁合入你的 Infinite Canvas 源码后重新部署：

- `canvas-event-bus.ts`：增加右键动作注册表
- `plugin-runtime.ts`：向远程插件暴露 `registerContextMenuAction`
- `canvas-plugin.ts`：增加对应类型
- `canvas-context-menu.tsx`：渲染第三方菜单项
- `project.tsx`：把当前选区和 `applyAgentOps` 注入菜单动作

补丁源码位于交付包中的 `host-patch/` 目录。若不合入补丁，插件仍可安装，但不会出现全局“排版优化”菜单项。
