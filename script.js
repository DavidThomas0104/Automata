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
