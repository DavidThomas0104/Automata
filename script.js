// ── DFA Definitions ───────────────────────────────────────────────────────────
const dfaOptions = [
    {
        name: "DFA 1 — (bab+bbb)ab…",
        alphabet: ["a", "b"],
        regex: "(bab+bbb)ab(a*+b*)(ba)(aba)(bab+aba)bb(a+b)(bab+aba)(a+b)",
        startState: "-",
        acceptStates: ["+"],
        transitions: {
            '-': { 'a': 'T1', 'b': 'q1' },
            'q1': { 'a': 'q2', 'b': 'q3' },
            'q2': { 'a': 'T2', 'b': 'q4' },
            'q3': { 'a': 'T3', 'b': 'q4' },
            'q4': { 'a': 'q5', 'b': 'q4' },
            'q5': { 'a': 'q5', 'b': 'q6' },
            'q6': { 'a': 'q7', 'b': 'q4' },
            'q7': { 'a': 'q7', 'b': 'q8' },
            'q8': { 'a': 'q7', 'b': 'q9' },
            'q9': { 'a': 'q10', 'b': 'q11' },
            'q10': { 'a': 'q10', 'b': 'q12' },
            'q11': { 'a': 'q13', 'b': 'q11' },
            'q12': { 'a': '+', 'b': 'q11' },
            'q13': { 'a': 'q10', 'b': '+' },
            '+': { 'a': '+', 'b': '+' },
            'T1': { 'a': 'T1', 'b': 'T1' },
            'T2': { 'a': 'T2', 'b': 'T2' },
            'T3': { 'a': 'T3', 'b': 'T3' }
        },
        gridLayout: {
            '-': [0, 0], 'q1': [1, 0],
            'q2': [2, -1], 'q3': [2, 1],
            'q4': [3, 0],
            'q5': [4, -1], 'q6': [4, 1],
            'q7': [5, 0],
            'q8': [6, -1], 'q9': [6, 1],
            'q10': [7, 0],
            'q11': [8, 1], 'q12': [8, -1],
            'q13': [9, 0],
            '+': [10, 0],
            'T1': [1, -2], 'T2': [2, -2], 'T3': [3, 2]
        }
    },
    {
        name: "DFA 2 — (1+0)(101+01+000)…",
        alphabet: ["0", "1"],
        regex: "(1+0)(101+01+000)(1+0)(101+00)(111+00+101)(1+0)",
        startState: "-",
        acceptStates: ["+"],
        transitions: {
            '-': { '1': 'q2', '0': 'q1' },
            'q1': { '1': 'q3', '0': 'q4' },
            'q2': { '1': 'q2', '0': 'q5' },
            'q3': { '1': '-', '0': 'q4' },
            'q4': { '1': 'q7', '0': 'q6' },
            'q5': { '1': 'q4', '0': 'q3' },
            'q6': { '1': 'q7', '0': '+' },
            'q7': { '1': 'q9', '0': 'q8' },
            'q8': { '1': '+', '0': 'q6' },
            'q9': { '1': '+', '0': 'q8' },
            '+': { '1': '+', '0': '+' }
        },
        gridLayout: {
            '-': [0, 0], 'q1': [1, -1], 'q2': [1, 1],
            'q3': [2, -1], 'q4': [2, 0], 'q5': [2, 1],
            'q6': [3, -1], 'q7': [3, 0], 'q8': [4, -1],
            'q9': [4, 1], '+': [5, 0]
        }
    }
];

// ── CFG Definitions ────────────────────────────────────────────────────────────
const cfgData = [
    // DFA 1: (bab+bbb)ab(a*+b*)(ba)(aba)(bab+aba)bb(a+b)(bab+aba)(a+b)
    {
        title: "CFG for (bab+bbb)ab(a*+b*)(ba)(aba)(bab+aba)bb(a+b)(bab+aba)(a+b)",
        rules: [
            { lhs: "S",  rhs: [["A", "B", "C", "D", "E", "F"]] },
            { lhs: "A",  rhs: [["bab"], ["bbb"]] },
            { lhs: "B",  rhs: [["a*"], ["b*"]] },
            { lhs: "C",  rhs: [["bab"], ["aba"]] },
            { lhs: "D",  rhs: [["a"], ["b"]] },
            { lhs: "E",  rhs: [["bab"], ["aba"]] },
            { lhs: "F",  rhs: [["a"], ["b"]] },
        ]
    },
    // DFA 2: (1+0)(101+01+000)(1+0)(101+00)(111+00+101)(1+0)
    {
        title: "CFG for (1+0)(101+01+000)(1+0)(101+00)(111+00+101)(1+0)",
        rules: [
            { lhs: "S",  rhs: [["A", "B", "C", "D", "E", "F"]] },
            { lhs: "A",  rhs: [["1"], ["0"]] },
            { lhs: "B",  rhs: [["101"], ["01"], ["000"]] },
            { lhs: "C",  rhs: [["1"], ["0"]] },
            { lhs: "D",  rhs: [["101"], ["00"]] },
            { lhs: "E",  rhs: [["111"], ["00"], ["101"]] },
            { lhs: "F",  rhs: [["1"], ["0"]] },
        ]
    }
];

// ── PDA Definitions ────────────────────────────────────────────────────────────
// const pdaData = [
//     // DFA 1 PDA
//     {
//         states: ["q0", "q1", "q2", "q3", "q4", "q5", "qacc"],
//         startState: "q0",
//         acceptState: "qacc",
//         stackStart: "Z",
//         transitions: [
//             { from: "q0", read: "b",   pop: "Z",   push: "AZ",  to: "q1",  note: "Read b, push A (expect ab+bb)" },
//             { from: "q1", read: "a",   pop: "A",   push: "BA",  to: "q2",  note: "Read a in bab branch, push B" },
//             { from: "q1", read: "b",   pop: "A",   push: "BA",  to: "q2",  note: "Read b in bbb branch, push B" },
//             { from: "q2", read: "b",   pop: "B",   push: "CB",  to: "q3",  note: "Complete bab/bbb, push C" },
//             { from: "q3", read: "a",   pop: "C",   push: "DC",  to: "q3",  note: "Read ab, push D (kleene star segment)" },
//             { from: "q3", read: "b",   pop: "D",   push: "D",   to: "q3",  note: "Loop kleene star b*" },
//             { from: "q3", read: "b",   pop: "C",   push: "EC",  to: "q4",  note: "Read ba, push E" },
//             { from: "q4", read: "a",   pop: "E",   push: "FA",  to: "q4",  note: "Read aba, push F" },
//             { from: "q4", read: "b",   pop: "F",   push: "GF",  to: "q5",  note: "Read bab/aba, push G" },
//             { from: "q5", read: "a",   pop: "G",   push: "ε",   to: "q5",  note: "Continue suffix" },
//             { from: "q5", read: "b",   pop: "G",   push: "ε",   to: "q5",  note: "Continue suffix" },
//             { from: "q5", read: "ε",   pop: "Z",   push: "Z",   to: "qacc", note: "Accept on empty stack segment" },
//         ],
//         // PDA diagram nodes and layout for sidebar drawing
//         diagramNodes: [
//             { id: "q0", label: "q0", x: 40,  y: 80, type: "start" },
//             { id: "q1", label: "q1", x: 130, y: 80, type: "normal" },
//             { id: "q2", label: "q2", x: 220, y: 40, type: "normal" },
//             { id: "q3", label: "q3", x: 310, y: 80, type: "normal" },
//             { id: "q4", label: "q4", x: 220, y: 120, type: "normal" },
//             { id: "q5", label: "q5", x: 310, y: 155, type: "normal" },
//             { id: "qacc", label: "qₐ", x: 370, y: 80, type: "accept" },
//         ],
//         diagramEdges: [
//             { from: "q0", to: "q1", label: "b,Z/AZ" },
//             { from: "q1", to: "q2", label: "a/b, A/BA" },
//             { from: "q2", to: "q3", label: "b, B/CB" },
//             { from: "q3", to: "q3", label: "a/b, loop" },
//             { from: "q3", to: "q4", label: "b, C/EC" },
//             { from: "q4", to: "q4", label: "aba, push" },
//             { from: "q4", to: "q5", label: "b, F/GF" },
//             { from: "q5", to: "q5", label: "a/b, G/ε" },
//             { from: "q5", to: "qacc", label: "ε, Z/Z" },
//         ]
//     },
//     // DFA 2 PDA
//     {
//         states: ["q0", "q1", "q2", "q3", "q4", "q5", "qacc"],
//         startState: "q0",
//         acceptState: "qacc",
//         stackStart: "Z",
//         transitions: [
//             { from: "q0", read: "1",   pop: "Z",   push: "AZ",  to: "q1",  note: "Read 1 or 0 (A segment)" },
//             { from: "q0", read: "0",   pop: "Z",   push: "AZ",  to: "q1",  note: "Read 1 or 0 (A segment)" },
//             { from: "q1", read: "1",   pop: "A",   push: "BA",  to: "q2",  note: "Start 101 branch, push B" },
//             { from: "q1", read: "0",   pop: "A",   push: "BA",  to: "q2",  note: "Start 01/000 branch, push B" },
//             { from: "q2", read: "0",   pop: "B",   push: "CB",  to: "q2",  note: "Continue B segment" },
//             { from: "q2", read: "1",   pop: "B",   push: "CB",  to: "q3",  note: "Complete B, push C" },
//             { from: "q3", read: "1",   pop: "C",   push: "DC",  to: "q3",  note: "Read C (1 or 0), push D" },
//             { from: "q3", read: "0",   pop: "C",   push: "DC",  to: "q3",  note: "Read C (1 or 0), push D" },
//             { from: "q3", read: "1",   pop: "D",   push: "ED",  to: "q4",  note: "Read D segment (101/00), push E" },
//             { from: "q3", read: "0",   pop: "D",   push: "ED",  to: "q4",  note: "Read D segment (101/00), push E" },
//             { from: "q4", read: "1",   pop: "E",   push: "FE",  to: "q5",  note: "Read E segment (111/00/101), push F" },
//             { from: "q4", read: "0",   pop: "E",   push: "FE",  to: "q5",  note: "Read E segment, push F" },
//             { from: "q5", read: "1",   pop: "F",   push: "ε",   to: "q5",  note: "Read F (1 or 0), pop F" },
//             { from: "q5", read: "0",   pop: "F",   push: "ε",   to: "q5",  note: "Read F (1 or 0), pop F" },
//             { from: "q5", read: "ε",   pop: "Z",   push: "Z",   to: "qacc", note: "Accept — stack back to Z" },
//         ],
//         diagramNodes: [
//             { id: "q0",   label: "q0",  x: 40,  y: 80,  type: "start" },
//             { id: "q1",   label: "q1",  x: 120, y: 80,  type: "normal" },
//             { id: "q2",   label: "q2",  x: 200, y: 40,  type: "normal" },
//             { id: "q3",   label: "q3",  x: 280, y: 80,  type: "normal" },
//             { id: "q4",   label: "q4",  x: 200, y: 120, type: "normal" },
//             { id: "q5",   label: "q5",  x: 320, y: 140, type: "normal" },
//             { id: "qacc", label: "qₐ",  x: 370, y: 80,  type: "accept" },
//         ],
//         diagramEdges: [
//             { from: "q0",   to: "q1",   label: "0/1, Z/AZ" },
//             { from: "q1",   to: "q2",   label: "0/1, A/BA" },
//             { from: "q2",   to: "q2",   label: "0, loop" },
//             { from: "q2",   to: "q3",   label: "1, B/CB" },
//             { from: "q3",   to: "q3",   label: "0/1, loop" },
//             { from: "q3",   to: "q4",   label: "0/1, D/ED" },
//             { from: "q4",   to: "q5",   label: "0/1, E/FE" },
//             { from: "q5",   to: "q5",   label: "0/1, F/ε" },
//             { from: "q5",   to: "qacc", label: "ε, Z/Z" },
//         ]
//     }
// ];

// ── State ─────────────────────────────────────────────────────────────────────
let currentDFAIndex = 0;
let currentDFA = dfaOptions[currentDFAIndex];
let currentState = currentDFA.startState;
let remainingInput = '';
let processedInput = '';
let isPlaying = false;
let playInterval = null;
let historyArray = [];
let sidebarOpen = false;

// ── DOM References ─────────────────────────────────────────────────────────────
const graphContainer   = document.getElementById("graph-container");
const inputEl          = document.getElementById("binary-input");
const currentStateEl   = document.getElementById("current-state-display");
const remainingEl      = document.getElementById("remaining-input-display");
const stepBtn          = document.getElementById("step-btn");
const playBtn          = document.getElementById("play-btn");
const resetBtn         = document.getElementById("reset-btn");
const speedSlider      = document.getElementById("speed-slider");
const playIcon         = document.getElementById("play-icon");
const pauseIcon        = document.getElementById("pause-icon");
const playText         = document.getElementById("play-text");
const bannerEl         = document.getElementById("validity-banner");
const dfaSelector      = document.getElementById("dfa-selector");
const validationMsg    = document.getElementById("validation-msg");
const historyDisplay   = document.getElementById("history-display");
const sidebar          = document.getElementById("cfg-pda-sidebar");
const sidebarCloseBtn  = document.getElementById("sidebar-close-btn");
const cfgPdaBtn        = document.getElementById("cfg-pda-btn");
const mainArea         = document.getElementById("main-area");
const controlPanel     = document.querySelector(".glass-panel");

// ── Graph Rendering ────────────────────────────────────────────────────────────
function renderGraph() {
    d3.select("#graph-container").selectAll("*").remove();

    let width  = graphContainer.clientWidth;
    let height = graphContainer.clientHeight;

    const svg = d3.select("#graph-container")
        .append("svg").attr("width", "100%").attr("height", "100%");

    svg.append("defs").selectAll("marker")
        .data(["arrow", "arrow-active"])
        .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25).attr("refY", -0.5)
        .attr("markerWidth", 6).attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path").attr("d", "M0,-5L10,0L0,5");

    const gMain = svg.append("g").attr("class", "graph-zoom-container");

    const zoom = d3.zoom().scaleExtent([0.1, 4]).on("zoom", e => gMain.attr("transform", e.transform));
    svg.call(zoom);

    const isMobile = width < 768;
    const initScale = currentDFA.name.includes("DFA 2") ? (isMobile ? 0.35 : 0.6) : (isMobile ? 0.7 : 1);
    const tx = (width / 2) * (1 - initScale);
    const ty = (height / 2) * (1 - initScale);
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(initScale));

    const transitions = currentDFA.transitions;
    const nodesData = Object.keys(transitions).map(id => {
        let n = { id };
        if (currentDFA.gridLayout) { n.gridX = currentDFA.gridLayout[id][0]; n.gridY = currentDFA.gridLayout[id][1]; }
        return n;
    });

    const linksData = [];
    for (const source in transitions) {
        for (const input in transitions[source]) {
            const target = transitions[source][input];
            let ex = linksData.find(l => l.source === source && l.target === target);
            if (ex) { ex.label += `,${input}`; ex.inputs.push(input); }
            else linksData.push({ source, target, label: input, inputs: [input] });
        }
    }

    const useGrid = !!currentDFA.gridLayout;
    const sim = d3.forceSimulation(nodesData)
        .force("link",    d3.forceLink(linksData).id(d => d.id).strength(useGrid ? 0 : 0.3).distance(140))
        .force("charge",  d3.forceManyBody().strength(useGrid ? -100 : -1200))
        .force("center",  d3.forceCenter(width / 2, height / 2 - 80))
        .force("collide", d3.forceCollide().radius(40));

    if (useGrid) {
        sim.force("x", d3.forceX(d => width / 2 + (d.gridX - 2.5) * 140).strength(1))
           .force("y", d3.forceY(d => height / 2 - 80 + d.gridY * 110).strength(1));
    } else {
        sim.force("x", d3.forceX(width / 2).strength(0.05))
           .force("y", d3.forceY(height / 2 - 80).strength(0.05));
    }

    const link = gMain.append("g").attr("class", "links").selectAll("g")
        .data(linksData).enter().append("g").attr("class", "link");
    const path = link.append("path").attr("id", (d, i) => `link-${i}`).attr("marker-end", "url(#arrow)");
    link.append("text").attr("dy", -5).append("textPath")
        .attr("href", (d, i) => `#link-${i}`).attr("startOffset", "50%")
        .style("text-anchor", "middle").text(d => d.label);

    const sanitize = id => id.replace(/[^a-zA-Z0-9_-]/g, '');
    const node = gMain.append("g").attr("class", "nodes").selectAll("g")
        .data(nodesData).enter().append("g").attr("class", "node")
        .attr("id", d => `node-${sanitize(d.id)}`)
        .call(d3.drag()
            .on("start", (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
            .on("drag",  (e, d) => { d.fx = e.x; d.fy = e.y; })
            .on("end",   (e, d) => { if (!e.active) sim.alphaTarget(0); }));

    node.append("circle").attr("r", 20);
    node.append("text").attr("dy", 5)
        .style("font-size", d => d.id.length > 5 ? "8px" : (d.id.length > 3 ? "10px" : "14px"))
        .text(d => {
            if (d.id === currentDFA.startState && !d.id.includes('-')) return '-' + d.id;
            if (currentDFA.acceptStates.includes(d.id) && !d.id.includes('+')) return '+' + d.id;
            return d.id;
        });

    function linkArc(d) {
        const dx = d.target.x - d.source.x, dy = d.target.y - d.source.y;
        const dr = Math.sqrt(dx * dx + dy * dy);
        if (d.source.id === d.target.id) {
            const x = d.source.x, y = d.source.y;
            return `M ${x-14} ${y-14} A 24 24 0 1 1 ${x+14} ${y-14}`;
        }
        return `M${d.source.x},${d.source.y}A${dr*1.5},${dr*1.5} 0 0,1 ${d.target.x},${d.target.y}`;
    }

    sim.on("tick", () => {
        path.attr("d", linkArc);
        node.attr("transform", d => `translate(${d.x},${d.y})`);
    });

    window.currentSimulation = sim;
    window.currentSvg = svg;
    window.currentUseGrid = useGrid;
}

// ── PDA Diagram Rendering ──────────────────────────────────────────────────────
function renderPDADiagram(index) {
    const container = document.getElementById("pda-diagram-container");
    container.innerHTML = "";
    const pda = pdaData[index];
    if (!pda) return;

    const W = 420, H = 200;
    const svg = d3.select(container).append("svg")
        .attr("width", "100%").attr("viewBox", `0 0 ${W} ${H}`);

    svg.append("defs").selectAll("marker")
        .data(["pda-arrow"])
        .enter().append("marker")
        .attr("id", "pda-arrow")
        .attr("viewBox", "0 -4 8 8")
        .attr("refX", 28).attr("refY", 0)
        .attr("markerWidth", 5).attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path").attr("d", "M0,-4L8,0L0,4").attr("fill", "rgba(52,211,153,0.6)");

    // Build node map
    const nodeMap = {};
    pda.diagramNodes.forEach(n => { nodeMap[n.id] = n; });

    // Draw edges
    pda.diagramEdges.forEach((e, i) => {
        const s = nodeMap[e.from], t = nodeMap[e.to];
        if (!s || !t) return;

        const g = svg.append("g").attr("class", "pda-edge");
        let d;
        if (e.from === e.to) {
            // Self-loop
            const x = s.x, y = s.y;
            d = `M ${x-12} ${y-12} A 20 20 0 1 1 ${x+12} ${y-12}`;
        } else {
            const dx = t.x - s.x, dy = t.y - s.y;
            const dr = Math.sqrt(dx*dx + dy*dy) * 1.6;
            d = `M${s.x},${s.y}A${dr},${dr} 0 0,1 ${t.x},${t.y}`;
        }

        g.append("path").attr("d", d).attr("marker-end", "url(#pda-arrow)");

        // Mid-point for label
        const mx = e.from === e.to ? s.x + 28 : (s.x + t.x) / 2 + (t.y - s.y) * 0.2;
        const my = e.from === e.to ? s.y - 28 : (s.y + t.y) / 2 - (t.x - s.x) * 0.2;

        const lblG = g.append("g").attr("transform", `translate(${mx},${my})`);
        const txt = lblG.append("text").attr("text-anchor", "middle").attr("dy", 3).attr("class", "pda-edge-lbl").text(e.label);

        const bBox = { w: e.label.length * 5.5 + 6, h: 13 };
        lblG.insert("rect", "text")
            .attr("x", -bBox.w/2).attr("y", -bBox.h/2)
            .attr("width", bBox.w).attr("height", bBox.h)
            .attr("rx", 3).attr("class", "pda-edge-label-box");
    });

    // Draw nodes
    pda.diagramNodes.forEach(n => {
        const g = svg.append("g").attr("class", `pda-node ${n.type === 'start' ? 'start-node' : n.type === 'accept' ? 'accept-node' : ''}`)
            .attr("transform", `translate(${n.x},${n.y})`);

        // Start arrow
        if (n.type === "start") {
            svg.append("line")
                .attr("x1", n.x - 22).attr("y1", n.y)
                .attr("x2", n.x - 14).attr("y2", n.y)
                .attr("stroke", "rgba(96,165,250,0.8)").attr("stroke-width", 1.5)
                .attr("marker-end", "url(#pda-arrow)");
        }

        g.append("circle").attr("r", 14);
        if (n.type === "accept") {
            g.append("circle").attr("r", 11).attr("fill", "none")
                .attr("stroke", "#fbbf24").attr("stroke-width", 1).attr("stroke-dasharray", "2 2");
        }
        g.append("text").attr("dy", 4).text(n.label).attr("fill", n.type === "accept" ? "#fde68a" : n.type === "start" ? "#93c5fd" : "#6ee7b7").attr("font-size", "10").attr("font-weight", "600").attr("text-anchor", "middle").attr("font-family", "Outfit, monospace");
    });

    // Style edge labels
    svg.selectAll(".pda-edge-lbl")
        .attr("fill", "#94a3b8").attr("font-size", "8").attr("font-family", "Outfit, monospace");
}

// ── CFG Rendering ──────────────────────────────────────────────────────────────
function renderCFG(index) {
    const container = document.getElementById("cfg-rules");
    container.innerHTML = "";
    const cfg = cfgData[index];
    if (!cfg) return;

    cfg.rules.forEach((rule, ri) => {
        const el = document.createElement("div");
        el.className = "cfg-rule";
        el.style.animationDelay = `${ri * 60}ms`;

        const lhsEl = document.createElement("span");
        lhsEl.className = "cfg-rule-lhs";
        lhsEl.textContent = rule.lhs;
        el.appendChild(lhsEl);

        const arrowEl = document.createElement("span");
        arrowEl.className = "cfg-rule-arrow";
        arrowEl.textContent = "→";
        el.appendChild(arrowEl);

        const rhsEl = document.createElement("span");
        rhsEl.className = "cfg-rule-rhs";

        const productions = rule.rhs.map(prod => {
            return prod.map(sym => {
                if (/^[A-Z]$/.test(sym)) {
                    return `<span class="nonterminal">${sym}</span>`;
                } else {
                    return `<span class="terminal">${sym}</span>`;
                }
            }).join(' ');
        }).join('<span class="pipe"> | </span>');

        rhsEl.innerHTML = productions;
        el.appendChild(rhsEl);
        container.appendChild(el);
    });
}

// ── PDA Transitions ────────────────────────────────────────────────────────────
function renderPDATransitions(index) {
    const container = document.getElementById("pda-transitions");
    container.innerHTML = "";
    const pda = pdaData[index];
    if (!pda) return;

    // Header label
    const hdr = document.createElement("div");
    hdr.className = "sidebar-section-title";
    hdr.style.marginBottom = "0.5rem";
    hdr.textContent = "Transition Function δ(q, a, γ)";
    container.appendChild(hdr);

    pda.transitions.forEach((t, i) => {
        const el = document.createElement("div");
        el.className = "pda-transition";
        el.style.animationDelay = `${i * 40}ms`;

        const numEl = document.createElement("span");
        numEl.className = "pda-step-num";
        numEl.textContent = `δ${i+1}`;
        el.appendChild(numEl);

        const body = document.createElement("span");
        body.className = "pda-transition-body";
        body.innerHTML =
            `δ(<span class="pda-state">${t.from}</span>, ` +
            `<span class="pda-sym">${t.read}</span>, ` +
            `<span class="pda-stack">${t.pop}</span>) = ` +
            `(<span class="pda-state">${t.to}</span>, ` +
            `<span class="pda-stack">${t.push}</span>)` +
            `<br><span style="color:#64748b;font-size:0.75rem">${t.note}</span>`;
        el.appendChild(body);
        container.appendChild(el);
    });
}

// ── Sidebar Controls ───────────────────────────────────────────────────────────
function openSidebar() {
    sidebarOpen = true;
    sidebar.classList.add("open");
    mainArea.classList.add("sidebar-open");
    controlPanel.classList.add("sidebar-open");
    cfgPdaBtn.classList.add("active");
    renderCFG(currentDFAIndex);
    renderPDADiagram(currentDFAIndex);
    renderPDATransitions(currentDFAIndex);
}

function closeSidebar() {
    sidebarOpen = false;
    sidebar.classList.remove("open");
    mainArea.classList.remove("sidebar-open");
    controlPanel.classList.remove("sidebar-open");
    cfgPdaBtn.classList.remove("active");
}

cfgPdaBtn.addEventListener("click", () => {
    sidebarOpen ? closeSidebar() : openSidebar();
});

sidebarCloseBtn.addEventListener("click", closeSidebar);

// Tabs
document.querySelectorAll(".sidebar-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".sidebar-tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".sidebar-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`${tab.dataset.tab}-content`).classList.add("active");
    });
});

// ── Banner ─────────────────────────────────────────────────────────────────────
function updateBanner() {
    if (processedInput.length === 0 || remainingInput.length > 0) {
        bannerEl.className = "banner"; return;
    }
    const isAccept = currentDFA.acceptStates.includes(currentState);
    bannerEl.className = `banner visible ${isAccept ? 'valid' : 'invalid'}`;
    bannerEl.textContent = isAccept
        ? `Valid String (Reached ${currentState})`
        : `Invalid String (Did not reach an accept state)`;
}

// ── Graph UI Update ────────────────────────────────────────────────────────────
function updateGraphUI() {
    const sanitize = id => id.replace(/[^a-zA-Z0-9_-]/g, '');
    d3.selectAll(".node").classed("active", false);
    d3.select(`#node-${sanitize(currentState)}`).classed("active", true);
    currentStateEl.textContent = currentState;
    remainingEl.textContent = remainingInput;
    stepBtn.disabled = remainingInput.length === 0;
    updateBanner();
    if (remainingInput.length === 0 && isPlaying) togglePlay();
}

// ── Link Pulse ─────────────────────────────────────────────────────────────────
function pulseLink(source, target) {
    d3.selectAll(".link").classed("active", false).select("path").attr("marker-end", "url(#arrow)");
    const activeLink = d3.selectAll(".link").filter(d => d.source.id === source && d.target.id === target);
    if (!activeLink.empty()) {
        activeLink.classed("active", true).select("path").attr("marker-end", "url(#arrow-active)");
        const duration = (2100 - parseInt(speedSlider.value)) * 0.8;
        setTimeout(() => {
            activeLink.classed("active", false).select("path").attr("marker-end", "url(#arrow)");
        }, duration);
    }
}

// ── Step ───────────────────────────────────────────────────────────────────────
function stepForward() {
    if (remainingInput.length === 0) return;
    const char = remainingInput[0];
    remainingInput = remainingInput.substring(1);
    processedInput += char;
    const nextState = currentDFA.transitions[currentState][char];
    pulseLink(currentState, nextState);
    historyArray.push(`${currentState} (${char}) &rarr; ${nextState}`);
    currentState = nextState;
    updateGraphUI();
    if (historyDisplay) {
        historyDisplay.innerHTML = historyArray.map(item => `<span class="history-item">${item}</span>`).join('');
        historyDisplay.parentElement.scrollTop = historyDisplay.parentElement.scrollHeight;
    }
}

// ── Play/Pause ─────────────────────────────────────────────────────────────────
function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.style.display = "none"; pauseIcon.style.display = "block";
        playText.textContent = "Pause"; inputEl.disabled = true;
        const delay = 2100 - parseInt(speedSlider.value);
        playInterval = setInterval(stepForward, delay);
    } else {
        playIcon.style.display = "block"; pauseIcon.style.display = "none";
        playText.textContent = "Play"; inputEl.disabled = false;
        clearInterval(playInterval);
    }
}

// ── Reset ──────────────────────────────────────────────────────────────────────
function resetApp() {
    if (isPlaying) togglePlay();
    currentState = currentDFA.startState;
    remainingInput = inputEl.value;
    processedInput = '';
    historyArray = [];
    if (historyDisplay) historyDisplay.innerHTML = '';
    inputEl.disabled = false;
    d3.selectAll(".link").classed("active", false).select("path").attr("marker-end", "url(#arrow)");
    updateGraphUI();
}

// ── Fluid DFA Switch ───────────────────────────────────────────────────────────
function switchDFA(newIndex) {
    if (isPlaying) togglePlay();

    // Fade out regex + graph
    graphContainer.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    graphContainer.style.opacity = "0";
    graphContainer.style.transform = "scale(0.97)";

    setTimeout(() => {
        currentDFAIndex = newIndex;
        currentDFA = dfaOptions[newIndex];
        currentState = currentDFA.startState;
        remainingInput = '';
        processedInput = '';
        historyArray = [];
        if (historyDisplay) historyDisplay.innerHTML = '';
        inputEl.value = '';
        inputEl.placeholder = `e.g. ${currentDFA.alphabet.join('')}${currentDFA.alphabet[0]}`;
        if (validationMsg) validationMsg.textContent = `Only ${currentDFA.alphabet.join(' and ')} are allowed.`;

        

        renderGraph();

        // Fade in
        graphContainer.style.opacity = "0";
        graphContainer.style.transform = "scale(0.97)";
        setTimeout(() => {
            graphContainer.style.transition = "opacity 0.4s ease, transform 0.4s ease";
            graphContainer.style.opacity = "1";
            graphContainer.style.transform = "scale(1)";
        }, 40);

        updateGraphUI();

        // Refresh sidebar if open
        if (sidebarOpen) {
            renderCFG(currentDFAIndex);
            renderPDADiagram(currentDFAIndex);
            renderPDATransitions(currentDFAIndex);
        }
    }, 300);
}

// ── Event Listeners ────────────────────────────────────────────────────────────
inputEl.addEventListener("input", e => {
    const validChars = currentDFA.alphabet.join('');
    const regex = new RegExp(`[^${validChars}]`, 'g');
    let val = e.target.value.replace(regex, "");
    if (val !== e.target.value) e.target.value = val;
    if (isPlaying) togglePlay();
    remainingInput = val;
    currentState = currentDFA.startState;
    processedInput = '';
    historyArray = [];
    if (historyDisplay) historyDisplay.innerHTML = '';
    updateGraphUI();
});

speedSlider.addEventListener("input", () => {
    if (isPlaying) {
        clearInterval(playInterval);
        playInterval = setInterval(stepForward, 2100 - parseInt(speedSlider.value));
    }
});

stepBtn.addEventListener("click",  () => { if (isPlaying) togglePlay(); stepForward(); });
playBtn.addEventListener("click",  () => { if (remainingInput.length > 0 || isPlaying) togglePlay(); });
resetBtn.addEventListener("click", resetApp);

dfaSelector.addEventListener("change", e => switchDFA(parseInt(e.target.value)));

window.addEventListener("resize", () => {
    const w = graphContainer.clientWidth, h = graphContainer.clientHeight;
    if (window.currentSvg) window.currentSvg.attr("width", w).attr("height", h);
    if (window.currentSimulation) {
        window.currentSimulation.force("center", d3.forceCenter(w / 2, h / 2 - 80));
        if (window.currentUseGrid) {
            window.currentSimulation
                .force("x", d3.forceX(d => w / 2 + (d.gridX - 2.5) * 140).strength(1))
                .force("y", d3.forceY(d => h / 2 - 80 + d.gridY * 110).strength(1));
        }
        window.currentSimulation.alpha(0.3).restart();
    }
});

// ── Initialize ─────────────────────────────────────────────────────────────────
setTimeout(() => {
    inputEl.placeholder = `e.g. ${currentDFA.alphabet.join('')}${currentDFA.alphabet[0]}`;
    if (validationMsg) validationMsg.textContent = `Only ${currentDFA.alphabet.join(' and ')} are allowed.`;
    renderGraph();
    updateGraphUI();
}, 200);
