// Infinite Canvas third-party plugin: grid layout optimization.
// Install this file from the Canvas "Third-party plugins" URL field.
export default function layoutOptimizePlugin(runtime) {
  function chooseColumns(count) {
    return Math.max(2, Math.ceil(Math.sqrt(count)));
  }

  function arrange(context) {
    var nodes = (context.selectedNodes || []).filter(function (node) {
      return node && node.position && Number.isFinite(node.width) && Number.isFinite(node.height);
    });
    if (nodes.length < 2) return;
    var columns = chooseColumns(nodes.length);
    var ordered = nodes.slice().sort(function (a, b) {
      return a.position.y - b.position.y || a.position.x - b.position.x || String(a.id).localeCompare(String(b.id));
    });
    var minX = Math.min.apply(null, ordered.map(function (node) { return node.position.x; }));
    var minY = Math.min.apply(null, ordered.map(function (node) { return node.position.y; }));
    var maxWidth = Math.max.apply(null, ordered.map(function (node) { return node.width; }));
    var maxHeight = Math.max.apply(null, ordered.map(function (node) { return node.height; }));
    var gapX = Math.max(32, Math.round(maxWidth * 0.12));
    var gapY = Math.max(32, Math.round(maxHeight * 0.12));
    context.applyOps(ordered.map(function (node, index) {
      return {
        type: "update_node",
        id: node.id,
        patch: { position: {
          x: minX + (index % columns) * (maxWidth + gapX),
          y: minY + Math.floor(index / columns) * (maxHeight + gapY)
        } }
      };
    }));
  }

  var unregister = runtime.registerContextMenuAction && runtime.registerContextMenuAction({
    id: "layout-optimize:arrange",
    label: "排版优化",
    icon: "▦",
    isVisible: function (context) { return (context.selectedNodes || []).length >= 2; },
    onClick: arrange
  });

  return {
    id: "layout-optimize",
    name: "排版优化",
    version: "1.0.0",
    description: "将选中的部件按接近方阵的网格自动排列。",
    nodes: [{
      type: "layout-optimize:anchor",
      title: "排版优化",
      icon: "▦",
      description: "排版优化插件状态节点",
      defaultSize: { width: 220, height: 96 },
      showInCreateMenu: false,
      hasSourceHandle: false,
      Content: function () { return null; }
    }],
    setup: function () { return unregister; }
  };
}
