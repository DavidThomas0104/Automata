const dfaOptions = [
    {
        name: "DFA 1 (Binary Strings)",
        alphabet: ["0", "1"],
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
    },
    {
        name: "DFA 2 ('a' / 'b' Strings)",
        alphabet: ["a", "b"],
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
    }
];

let currentDFAIndex = 0;
let currentDFA = dfaOptions[currentDFAIndex];

let currentState = currentDFA.startState;
let remainingInput = '';
let processedInput = '';
let isPlaying = false;
let playInterval = null;
let historyArray = [];

const graphContainer = document.getElementById("graph-container");
const inputEl = document.getElementById("binary-input");
const currentStateEl = document.getElementById("current-state-display");
const remainingEl = document.getElementById("remaining-input-display");
const stepBtn = document.getElementById("step-btn");
const playBtn = document.getElementById("play-btn");
const resetBtn = document.getElementById("reset-btn");
const speedSlider = document.getElementById("speed-slider");
const playIcon = document.getElementById("play-icon");
const pauseIcon = document.getElementById("pause-icon");
const playText = document.getElementById("play-text");
const bannerEl = document.getElementById("validity-banner");
const dfaSelector = document.getElementById("dfa-selector");
const validationMsg = document.getElementById("validation-msg");
const historyDisplay = document.getElementById("history-display");

function renderGraph() {
    d3.select("#graph-container").selectAll("*").remove();

    let width = graphContainer.clientWidth;
    let height = graphContainer.clientHeight;

    const svg = d3.select("#graph-container")
        .append("svg")
        .attr("width", "100%")
        .attr("height", "100%");

    svg.append("defs").selectAll("marker")
        .data(["arrow", "arrow-active"])
        .enter().append("marker")
        .attr("id", d => d)
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 25)
        .attr("refY", -0.5)
        .attr("markerWidth", 6)
        .attr("markerHeight", 6)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5");

    const gMain = svg.append("g").attr("class", "graph-zoom-container");

    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            gMain.attr("transform", event.transform);
        });
    svg.call(zoom);

    // Initial transform to fit larger graphs
    const isMobile = width < 768;
    const initScale = currentDFA.name.includes("DFA 2") ? (isMobile ? 0.35 : 0.6) : (isMobile ? 0.7 : 1);
    const tx = (width / 2) * (1 - initScale);
    const ty = (height / 2) * (1 - initScale);
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(initScale));

    const transitions = currentDFA.transitions;
    const nodesData = Object.keys(transitions).map(id => {
        let nodeObj = { id };
        if (currentDFA.gridLayout) {
            nodeObj.gridX = currentDFA.gridLayout[id][0];
            nodeObj.gridY = currentDFA.gridLayout[id][1];
        }
        return nodeObj;
    });

    const linksData = [];
    for (const source in transitions) {
        const targets = transitions[source];
        for (const input in targets) {
            const target = targets[input];
            let existingLink = linksData.find(l => l.source === source && l.target === target);
            if (existingLink) {
                existingLink.label += `,${input}`;
                existingLink.inputs.push(input);
            } else {
                linksData.push({
                    source,
                    target,
                    label: input,
                    inputs: [input]
                });
            }
        }
    }

    let useGrid = !!currentDFA.gridLayout;

    const simulation = d3.forceSimulation(nodesData)
        .force("link", d3.forceLink(linksData).id(d => d.id).strength(useGrid ? 0 : 0.3).distance(140))
        .force("charge", d3.forceManyBody().strength(useGrid ? -100 : -1200))
        .force("center", d3.forceCenter(width / 2, height / 2 - 80));

    if (useGrid) {
        simulation.force("x", d3.forceX(d => width / 2 + (d.gridX - 2.5) * 140).strength(1))
            .force("y", d3.forceY(d => height / 2 - 80 + d.gridY * 110).strength(1));
    } else {
        simulation.force("x", d3.forceX(width / 2).strength(0.05))
            .force("y", d3.forceY(height / 2 - 80).strength(0.05));
    }
    simulation.force("collide", d3.forceCollide().radius(40));

    const link = gMain.append("g")
        .attr("class", "links")
        .selectAll("g")
        .data(linksData)
        .enter().append("g")
        .attr("class", "link");

    const path = link.append("path")
        .attr("id", (d, i) => `link-${i}`)
        .attr("marker-end", "url(#arrow)");

    link.append("text")
        .attr("dy", -5)
        .append("textPath")
        .attr("href", (d, i) => `#link-${i}`)
        .attr("startOffset", "50%")
        .style("text-anchor", "middle")
        .text(d => d.label);

    const sanitizeId = id => id.replace(/[^a-zA-Z0-9_-]/g, '');

    const node = gMain.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodesData)
        .enter().append("g")
        .attr("class", "node")
        .attr("id", d => `node-${sanitizeId(d.id)}`)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    node.append("circle").attr("r", 20);

    node.append("text")
        .attr("dy", 5)
        .style("font-size", d => d.id.length > 5 ? "8px" : (d.id.length > 3 ? "10px" : "14px"))
        .text(d => {
            if (d.id === currentDFA.startState && !d.id.includes('-')) return '-' + d.id;
            if (currentDFA.acceptStates.includes(d.id) && !d.id.includes('+')) return '+' + d.id;
            return d.id;
        });

    function linkArc(d) {
        const dx = d.target.x - d.source.x,
            dy = d.target.y - d.source.y,
            dr = Math.sqrt(dx * dx + dy * dy);

        if (d.source.id === d.target.id) {
            const x = d.source.x, y = d.source.y;
            return `M ${x - 14} ${y - 14} A 24 24 0 1 1 ${x + 14} ${y - 14}`;
        }

        const radius = dr * 1.5;
        return `M${d.source.x},${d.source.y}A${radius},${radius} 0 0,1 ${d.target.x},${d.target.y}`;
    }

    simulation.on("tick", () => {
        path.attr("d", linkArc);
        node.attr("transform", d => {
            return `translate(${d.x},${d.y})`
        });
    });

    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(event, d) {
        d.fx = event.x;
        d.fy = event.y;
    }

    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
    }

    window.currentSimulation = simulation;
    window.currentSvg = svg;
    window.currentUseGrid = useGrid;
}

window.addEventListener("resize", () => {
    let width = graphContainer.clientWidth;
    let height = graphContainer.clientHeight;
    if (window.currentSvg) window.currentSvg.attr("width", width).attr("height", height);
    if (window.currentSimulation) {
        window.currentSimulation.force("center", d3.forceCenter(width / 2, height / 2 - 80));
        if (window.currentUseGrid) {
            window.currentSimulation.force("x", d3.forceX(d => width / 2 + (d.gridX - 2.5) * 140).strength(1))
                .force("y", d3.forceY(d => height / 2 - 80 + d.gridY * 110).strength(1));
        }
        window.currentSimulation.alpha(0.3).restart();
    }
});

function updateBanner() {
    if (processedInput.length === 0 || remainingInput.length > 0) {
        bannerEl.className = "banner";
        return;
    }

    let isAccept = currentDFA.acceptStates.includes(currentState);
    bannerEl.className = `banner visible ${isAccept ? 'valid' : 'invalid'}`;
    bannerEl.textContent = isAccept ? `Valid String (Reached ${currentState})` : `Invalid String (Did not reach an accept state)`;
}

function updateGraphUI() {
    const sanitizeId = id => id.replace(/[^a-zA-Z0-9_-]/g, '');
    d3.selectAll(".node").classed("active", false);
    d3.select(`#node-${sanitizeId(currentState)}`).classed("active", true);

    currentStateEl.textContent = currentState;
    remainingEl.textContent = remainingInput;

    stepBtn.disabled = remainingInput.length === 0;

    updateBanner();

    if (remainingInput.length === 0 && isPlaying) {
        togglePlay();
    }
}

function pulseLink(source, target) {
    d3.selectAll(".link").classed("active", false).select("path").attr("marker-end", "url(#arrow)");
    const activeLink = d3.selectAll(".link").filter(d => d.source.id === source && d.target.id === target);
    if (!activeLink.empty()) {
        activeLink.classed("active", true).select("path").attr("marker-end", "url(#arrow-active)");
        let linkSpeed = parseInt(speedSlider.value);
        let duration = (2100 - linkSpeed) * 0.8;
        setTimeout(() => {
            activeLink.classed("active", false).select("path").attr("marker-end", "url(#arrow)");
        }, duration);
    }
}

function stepForward() {
    if (remainingInput.length === 0) return;
    const char = remainingInput[0];
    remainingInput = remainingInput.substring(1);
    processedInput += char;
    const nextState = currentDFA.transitions[currentState][char];
    pulseLink(currentState, nextState);
    
    // Track transition in history
    const historyEntry = `${currentState} (${char}) &rarr; ${nextState}`;
    historyArray.push(historyEntry);
    
    currentState = nextState;
    updateGraphUI();
    
    if (historyDisplay) {
        historyDisplay.innerHTML = historyArray.map(item => `<span class="history-item">${item}</span>`).join('');
        const historyContainer = historyDisplay.parentElement;
        historyContainer.scrollTop = historyContainer.scrollHeight;
    }
}

function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
        playIcon.style.display = "none";
        pauseIcon.style.display = "block";
        playText.textContent = "Pause";
        inputEl.disabled = true;
        let speed = parseInt(speedSlider.value);
        let delay = 2100 - speed;
        playInterval = setInterval(stepForward, delay);
    } else {
        playIcon.style.display = "block";
        pauseIcon.style.display = "none";
        playText.textContent = "Play";
        inputEl.disabled = false;
        clearInterval(playInterval);
    }
}

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

inputEl.addEventListener("input", (e) => {
    const validChars = currentDFA.alphabet.join('');
    const regex = new RegExp(`[^${validChars}]`, 'g');
    let val = e.target.value.replace(regex, "");

    if (val !== e.target.value) {
        e.target.value = val;
    }

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
        let speed = parseInt(speedSlider.value);
        let delay = 2100 - speed;
        playInterval = setInterval(stepForward, delay);
    }
});

stepBtn.addEventListener("click", () => {
    if (isPlaying) togglePlay();
    stepForward();
});

playBtn.addEventListener("click", () => {
    if (remainingInput.length > 0 || isPlaying) {
        togglePlay();
    }
});
resetBtn.addEventListener("click", resetApp);

dfaSelector.addEventListener("change", (e) => {
    if (isPlaying) togglePlay();
    currentDFAIndex = parseInt(e.target.value);
    currentDFA = dfaOptions[currentDFAIndex];

    currentState = currentDFA.startState;
    remainingInput = '';
    processedInput = '';
    historyArray = [];
    if (historyDisplay) historyDisplay.innerHTML = '';
    inputEl.value = '';

    let exStr = currentDFA.alphabet.join('') + currentDFA.alphabet[0];
    inputEl.placeholder = `e.g. ${exStr}`;

    if (validationMsg) {
        validationMsg.textContent = `Only ${currentDFA.alphabet.join(' and ')} are allowed.`;
    }

    renderGraph();
    updateGraphUI();
});

// Initialize app
setTimeout(() => {
    let exStr = currentDFA.alphabet.join('') + currentDFA.alphabet[0];
    inputEl.placeholder = `e.g. ${exStr}`;
    if (validationMsg) {
        validationMsg.textContent = `Only ${currentDFA.alphabet.join(' and ')} are allowed.`;
    }
    renderGraph();
    updateGraphUI();
}, 200);

// =============================================
// CFG / PDA FEATURE
// =============================================

// ---- Regex Parser ----
// Supports: literals, |, *, +, ?, ()
// Parses into an AST

function parseRegex(pattern) {
    let pos = 0;

    function peek() { return pattern[pos]; }
    function consume(ch) {
        if (ch && pattern[pos] !== ch) throw new Error(`Expected '${ch}' at pos ${pos}`);
        return pattern[pos++];
    }

    function parseExpr() {
        let node = parseConcaten();
        while (pos < pattern.length && peek() === '|') {
            consume('|');
            let right = parseConcaten();
            node = { type: 'union', left: node, right };
        }
        return node;
    }

    function parseConcaten() {
        let nodes = [];
        while (pos < pattern.length && peek() !== ')' && peek() !== '|') {
            nodes.push(parseQuantifier());
        }
        if (nodes.length === 0) return { type: 'epsilon' };
        if (nodes.length === 1) return nodes[0];
        return nodes.reduce((a, b) => ({ type: 'concat', left: a, right: b }));
    }

    function parseQuantifier() {
        let node = parseAtom();
        while (pos < pattern.length && ['*', '+', '?'].includes(peek())) {
            const op = consume();
            if (op === '*') node = { type: 'star', child: node };
            else if (op === '+') node = { type: 'plus', child: node };
            else if (op === '?') node = { type: 'optional', child: node };
        }
        return node;
    }

    function parseAtom() {
        if (peek() === '(') {
            consume('(');
            let node = parseExpr();
            consume(')');
            return node;
        }
        if (peek() === '\\') {
            consume('\\');
            return { type: 'literal', value: consume() };
        }
        if (peek() === 'ε' || peek() === 'ϵ') {
            consume();
            return { type: 'epsilon' };
        }
        return { type: 'literal', value: consume() };
    }

    try {
        const ast = parseExpr();
        return ast;
    } catch (e) {
        throw new Error('Invalid regex: ' + e.message);
    }
}

// ---- Regex AST → CFG Productions ----
let cfgVarCounter = 0;
function freshVar() {
    const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','T','U','V','W','X','Y','Z'];
    const idx = cfgVarCounter++;
    const base = letters[idx % letters.length];
    const suffix = Math.floor(idx / letters.length);
    return suffix === 0 ? base : base + suffix;
}

function astToCFG(ast) {
    cfgVarCounter = 0;
    const productions = {}; // { NT: [['sym',...], ...] }
    const startSymbol = 'S';

    function addProd(nt, rhs) {
        if (!productions[nt]) productions[nt] = [];
        productions[nt].push(rhs);
    }

    function generate(node, nt) {
        switch (node.type) {
            case 'epsilon':
                addProd(nt, ['ε']);
                break;
            case 'literal':
                addProd(nt, [node.value]);
                break;
            case 'union': {
                const L = freshVar(), R = freshVar();
                addProd(nt, [L]);
                addProd(nt, [R]);
                generate(node.left, L);
                generate(node.right, R);
                break;
            }
            case 'concat': {
                const L = freshVar(), R = freshVar();
                addProd(nt, [L, R]);
                generate(node.left, L);
                generate(node.right, R);
                break;
            }
            case 'star': {
                const C = freshVar();
                addProd(nt, ['ε']);
                addProd(nt, [C, nt]);
                generate(node.child, C);
                break;
            }
            case 'plus': {
                // A+ = A A*
                const C = freshVar(), Star = freshVar();
                addProd(nt, [C, Star]);
                generate(node.child, C);
                // Star is like A*
                const Inner = freshVar();
                addProd(Star, ['ε']);
                addProd(Star, [Inner, Star]);
                generate(node.child, Inner);
                break;
            }
            case 'optional': {
                const C = freshVar();
                addProd(nt, ['ε']);
                addProd(nt, [C]);
                generate(node.child, C);
                break;
            }
        }
    }

    generate(ast, startSymbol);
    return { startSymbol, productions };
}

// ---- Simplify CFG (remove unit rules, merge simple chains) ----
function simplifyAndFormatCFG(cfg) {
    const { startSymbol, productions } = cfg;
    // Identify which NTs are "intermediate" (only one production, which is just another NT)
    // For display, we inline trivial aliases
    const inline = {};
    for (const [nt, prods] of Object.entries(productions)) {
        if (nt === startSymbol) continue;
        if (prods.length === 1 && prods[0].length === 1) {
            const sym = prods[0][0];
            // If sym is a terminal or epsilon, mark for inlining
            if (sym === 'ε' || (sym.length === 1 && sym !== sym.toUpperCase())) {
                inline[nt] = sym;
            }
        }
    }

    function resolveSymbol(sym) {
        let seen = new Set();
        while (inline[sym] && !seen.has(sym)) {
            seen.add(sym);
            sym = inline[sym];
        }
        return sym;
    }

    const resolved = {};
    for (const [nt, prods] of Object.entries(productions)) {
        if (inline[nt]) continue; // skip inlined
        resolved[nt] = prods.map(rhs => rhs.map(resolveSymbol));
    }

    // Deduplicate
    for (const [nt, prods] of Object.entries(resolved)) {
        const seen = new Set();
        resolved[nt] = prods.filter(rhs => {
            const key = rhs.join(' ');
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    return { startSymbol, productions: resolved };
}

function renderCFG(cfg) {
    const { startSymbol, productions } = cfg;
    const box = document.getElementById('cfg-output');
    let html = '';
    // Start symbol first
    const orderedNTs = [startSymbol, ...Object.keys(productions).filter(k => k !== startSymbol)];
    for (const nt of orderedNTs) {
        if (!productions[nt]) continue;
        const prods = productions[nt];
        const rhsHtml = prods.map(rhs =>
            rhs.map(sym => {
                if (sym === 'ε') return `<span class="eps">ε</span>`;
                const isNT = sym.length > 0 && sym[0] === sym[0].toUpperCase() && /^[A-Z]/.test(sym) && sym.length <= 3;
                if (isNT) return `<span class="nt">${sym}</span>`;
                return `<span class="terminal">${sym}</span>`;
            }).join(' ')
        ).join(`<span class="or"> | </span>`);
        html += `<div><span class="nt">${nt}</span><span class="arrow"> → </span>${rhsHtml}</div>`;
    }
    box.innerHTML = html;
}

// ---- Regex → PDA (via CFG) ----
// Build a simple 3-state PDA based on the CFG conversion approach:
// States: q_start, q_loop (stack processing), q_accept
// This is the standard "CFG → PDA via top-down parsing" construction.

function buildPDA(cfg, regex) {
    // Standard CFG-to-PDA construction (top-down)
    // States: q0 (start), q_loop (main), q_accept
    // Stack alphabet: all NTs + terminals + $ (bottom)
    // Transitions:
    //   q0 → q_loop on (ε, ε → S$)
    //   q_loop → q_loop on (ε, A → α) for each production A → α
    //   q_loop → q_loop on (a, a → ε) for each terminal a
    //   q_loop → q_accept on (ε, $ → ε)

    const states = ['q₀', 'q_loop', 'q_accept'];
    const startState = 'q₀';
    const acceptState = 'q_accept';

    const { startSymbol, productions } = cfg;
    const terminals = new Set();
    for (const prods of Object.values(productions)) {
        for (const rhs of prods) {
            for (const sym of rhs) {
                if (sym !== 'ε' && !/^[A-Z]/.test(sym)) terminals.add(sym);
            }
        }
    }

    // Build transition descriptions for display
    const transitions = [];
    transitions.push({ from: 'q₀', to: 'q_loop', label: 'ε, ε → ' + startSymbol + '$' });
    for (const [nt, prods] of Object.entries(productions)) {
        for (const rhs of prods) {
            const pushStr = rhs[0] === 'ε' ? 'ε' : [...rhs].reverse().join('');
            transitions.push({ from: 'q_loop', to: 'q_loop', label: `ε, ${nt} → ${pushStr}` });
        }
    }
    for (const t of terminals) {
        transitions.push({ from: 'q_loop', to: 'q_loop', label: `${t}, ${t} → ε` });
    }
    transitions.push({ from: 'q_loop', to: 'q_accept', label: 'ε, $ → ε' });

    return { states, startState, acceptState, transitions };
}

function renderPDADescription(pda, cfg, regex) {
    const { states, startState, acceptState } = pda;
    const { productions } = cfg;
    const terminals = new Set();
    for (const prods of Object.values(productions)) {
        for (const rhs of prods) {
            for (const sym of rhs) {
                if (sym !== 'ε' && !/^[A-Z]/.test(sym)) terminals.add(sym);
            }
        }
    }

    const box = document.getElementById('pda-description');
    box.innerHTML = `
        <strong>PDA via CFG Top-Down Parsing Construction</strong><br>
        This PDA accepts the same language as the regex <code style="color:var(--node-active)">${escapeHtml(regex)}</code> 
        by simulating derivations in the equivalent CFG using a stack.<br><br>
        <span class="pda-tuple">M = (Q, Σ, Γ, δ, q₀, $, {q_accept})</span>
        <strong>Q</strong> = {${states.join(', ')}} &nbsp;|&nbsp;
        <strong>Σ</strong> = {${[...terminals].join(', ') || 'Σ'}} &nbsp;|&nbsp;
        <strong>Γ</strong> = Σ ∪ {${Object.keys(productions).join(', ')}, $}<br>
        <strong>Idea:</strong> Push <em>S$</em> onto the stack, then repeatedly expand the top NT using a production (ε-transition), 
        or pop a terminal matching the current input symbol. Accept when $ is popped.
    `;
}

function escapeHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderPDAGraph(pda) {
    const container = document.getElementById('pda-graph-container');
    d3.select('#pda-graph-container').selectAll('*').remove();

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select('#pda-graph-container')
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

    svg.append('defs').selectAll('marker')
        .data(['pda-arrow'])
        .enter().append('marker')
        .attr('id', d => d)
        .attr('viewBox', '0 -5 10 10')
        .attr('refX', 28)
        .attr('refY', -0.5)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient', 'auto')
        .append('path')
        .attr('d', 'M0,-5L10,0L0,5')
        .attr('fill', '#4b5563');

    const gMain = svg.append('g');
    svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => gMain.attr('transform', e.transform)));

    const { states, startState, acceptState, transitions } = pda;

    // Position: q0 left, q_loop center, q_accept right
    const posMap = {
        'q₀': { x: width * 0.18, y: height / 2 },
        'q_loop': { x: width * 0.5, y: height / 2 },
        'q_accept': { x: width * 0.82, y: height / 2 },
    };

    const nodesData = states.map(id => ({ id, ...posMap[id] }));

    // Group self-loops on q_loop and summarize for display
    const selfLoops = transitions.filter(t => t.from === t.to);
    const mainEdges = transitions.filter(t => t.from !== t.to);

    // Represent q_loop self-loops with a summary label
    const selfLoopCount = selfLoops.length;
    const selfLoopLabel = `${selfLoopCount} rules`;

    // Draw main edges
    const edgesForRender = [
        ...mainEdges,
        ...(selfLoopCount > 0 ? [{ from: 'q_loop', to: 'q_loop', label: selfLoopLabel, isSummary: true }] : [])
    ];

    // Links
    const linkGroups = gMain.append('g').selectAll('g')
        .data(edgesForRender)
        .enter().append('g')
        .attr('class', 'pda-link');

    linkGroups.append('path')
        .attr('d', d => {
            const src = posMap[d.from];
            const tgt = posMap[d.to];
            if (d.from === d.to) {
                const x = src.x, y = src.y;
                return `M ${x - 16} ${y - 16} A 28 28 0 1 1 ${x + 16} ${y - 16}`;
            }
            return `M${src.x},${src.y} L${tgt.x},${tgt.y}`;
        })
        .attr('fill', 'none')
        .attr('stroke', d => d.isSummary ? '#3b82f6' : '#4b5563')
        .attr('stroke-width', 1.8)
        .attr('stroke-dasharray', d => d.isSummary ? '5,3' : null)
        .attr('marker-end', 'url(#pda-arrow)');

    linkGroups.append('text')
        .attr('x', d => {
            const src = posMap[d.from];
            const tgt = posMap[d.to];
            if (d.from === d.to) return src.x + 34;
            return (src.x + tgt.x) / 2;
        })
        .attr('y', d => {
            const src = posMap[d.from];
            const tgt = posMap[d.to];
            if (d.from === d.to) return src.y - 34;
            return (src.y + tgt.y) / 2 - 10;
        })
        .attr('text-anchor', 'middle')
        .attr('fill', d => d.isSummary ? '#7dd3fc' : '#9ca3af')
        .attr('font-size', 10)
        .attr('font-family', 'Outfit, sans-serif')
        .text(d => d.label);

    // Nodes
    const nodeGroups = gMain.append('g').selectAll('g')
        .data(nodesData)
        .enter().append('g')
        .attr('class', d => {
            let cls = 'pda-node';
            if (d.id === startState) cls += ' start';
            if (d.id === acceptState) cls += ' accept';
            return cls;
        })
        .attr('transform', d => `translate(${d.x},${d.y})`);

    nodeGroups.append('circle')
        .attr('r', 22)
        .attr('fill', '#1f2937')
        .attr('stroke', d => {
            if (d.id === acceptState) return '#34d399';
            if (d.id === startState) return '#3b82f6';
            return '#374151';
        })
        .attr('stroke-width', 2.5);

    // Double ring for accept state
    nodeGroups.filter(d => d.id === acceptState)
        .append('circle')
        .attr('r', 17)
        .attr('fill', 'none')
        .attr('stroke', '#34d399')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.7);

    // Start arrow
    nodeGroups.filter(d => d.id === startState)
        .append('line')
        .attr('x1', -42).attr('y1', 0)
        .attr('x2', -23).attr('y2', 0)
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 1.8)
        .attr('marker-end', 'url(#pda-arrow)');

    nodeGroups.append('text')
        .attr('dy', 4)
        .attr('text-anchor', 'middle')
        .attr('fill', '#e5e7eb')
        .attr('font-size', 11)
        .attr('font-weight', 600)
        .attr('font-family', 'Outfit, sans-serif')
        .text(d => d.id);
}

// ---- Render full transition table in a tooltip-able way ----
// (Shown inside the PDA description section's detail panel)

// ---- Main Convert Function ----
function convertRegexToCFGAndPDA() {
    const regexInput = document.getElementById('regex-input').value.trim();
    if (!regexInput) return;

    try {
        const ast = parseRegex(regexInput);
        const rawCFG = astToCFG(ast);
        const cleanedCFG = simplifyAndFormatCFG(rawCFG);
        const pda = buildPDA(cleanedCFG, regexInput);

        // Show results
        document.getElementById('cfg-placeholder').style.display = 'none';
        document.getElementById('cfg-pda-results').classList.remove('hidden');

        renderCFG(cleanedCFG);
        renderPDADescription(pda, cleanedCFG, regexInput);
        renderPDAGraph(pda);

    } catch (err) {
        document.getElementById('cfg-placeholder').style.display = 'flex';
        document.getElementById('cfg-pda-results').classList.add('hidden');
        document.getElementById('cfg-placeholder').innerHTML = `
            <svg viewBox="0 0 24 24" width="40" height="40" stroke="#ef4444" stroke-width="1.5" fill="none"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p style="color:#f87171">${escapeHtml(err.message)}</p>
        `;
    }
}

// ---- UI Wiring ----
const cfgPdaBtn = document.getElementById('cfg-pda-btn');
const cfgOverlay = document.getElementById('cfg-pda-overlay');
const cfgCloseBtn = document.getElementById('cfg-close-btn');
const convertBtn = document.getElementById('convert-btn');
const regexInput = document.getElementById('regex-input');

cfgPdaBtn.addEventListener('click', () => {
    cfgOverlay.classList.remove('hidden');
});

cfgCloseBtn.addEventListener('click', () => {
    cfgOverlay.classList.add('hidden');
});

cfgOverlay.addEventListener('click', (e) => {
    if (e.target === cfgOverlay) cfgOverlay.classList.add('hidden');
});

convertBtn.addEventListener('click', convertRegexToCFGAndPDA);

regexInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') convertRegexToCFGAndPDA();
});
