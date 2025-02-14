var currentMarkerIdWS = null;
var currentPegel = null;

punkte_pegel.on('click', function(e) {
    // Access the clicked feature's properties
    var clickedFeatureWS = e.layer.feature;
    var attributeValueWS = clickedFeatureWS.properties.Intern_Bez;
    currentPegel = clickedFeatureWS.properties.MESSST_BEZ;

    // Update plot if legend has not been added
    if (!legendAdded) {
        updatePlotWS(attributeValueWS);
    }
});

var lastXValue_nominal = null;
var lastXValue = null;
var startXValue = null;

function updatePlotWS(markerId) {
    console.log('Updating ws_plot with marker ID:', markerId);
    currentMarkerIdWS = markerId;

    // Convert timestamp strings to Date objects for x-axis
    const xValues_messung = Object.keys(ws_messung[markerId]).map(dateStr => new Date(dateStr));
    const yValues_messung = Object.values(ws_messung[markerId]);

    lastXValue_nominal = xValues_messung[xValues_messung.length - 1]; 
    startXValue = new Date(lastXValue_nominal.getTime() - 18 * 60 * 60 * 1000); // 24 hours before lastX
    lastXValue = new Date(lastXValue_nominal.getTime() + 120 * 60 * 60 * 1000); // 6 or 12 hours after lastX
    
    const xValues_prognose = Object.keys(ws_prognose[markerId]).map(dateStr => new Date(dateStr));
    const yValues_prognose = Object.values(ws_prognose[markerId]);

    const trace1 = {
        x: xValues_messung,
        y: yValues_messung,
        type: 'scatter',
        mode: 'lines',
        name: 'Messung',
        line: { color: '#6d6af2' }
    };

    const trace2 = {
        x: xValues_prognose,
        y: yValues_prognose,
        type: 'scatter',
        mode: 'lines',
        name: 'Prognose',
        line: { color: '#e84f7a' }
    };

    // Calculate the maximum y-value and add 10%
    const maxYValue = Math.max(...yValues_messung);
    const maxYValuePlus15Percent = maxYValue * 1.15;

    // Check for HW values and add horizontal lines if markerId matches
    var schwellenwerte = {
        "M-001": { "HW100": 352, "HW50": 335, "HW20": 312, "HW10": 295, "HW2": 248, "MW": 64, "MNW": 23 },
        "M-002": { "HW100": 356, "HW50": 332, "HW20": 299, "HW10": 272, "HW2": 207, "MW": 60, "MNW": 34 },
        "M-003": { "HW100": 293, "HW50": 260, "HW20": 210, "HW10": 169, "HW2": 102, "MW": 32, "MNW": 4 },
        "M-004": { "HW100": 363, "HW50": 340, "HW20": 305, "HW10": 279, "HW2": 221, "MW": 74, "MNW": 49 },
        "M-005": {},
        "M-006": { "HW100": 235, "HW50": 217, "HW20": 193, "HW10": 175, "HW2": 134, "MW": 38, "MNW": 22 },
        "M-007": {},
        "M-008": {}
    };

    var hwKeys = {
        "HW2": "rgb(243,240,60)",
        "HW10": "rgb(248,174,100)",
        "HW20": "rgb(222,10,20)",
        "HW50": "rgb(138,45,135)",
        "HW100": "rgb(91,16,91)"
    };

    var horizontalLines = [];
    if (schwellenwerte.hasOwnProperty(markerId)) {
        for (var key in hwKeys) {
            if (schwellenwerte[markerId].hasOwnProperty(key)) {
                horizontalLines.push({
                    type: 'line',
                    x0: xValues_messung[0],
                    x1: lastXValue,
                    y0: schwellenwerte[markerId][key],
                    y1: schwellenwerte[markerId][key],
                    line: {
                        color: hwKeys[key],
                        width: 3,
                        dash: 'dot'  // Change this to 'solid', 'dash', 'dot', 'dashdot', 'longdash', or 'longdashdot'
                    },
                    layer: 'below'
                });
            }
        }
    }

    const layout = {
        title: {
            text: `Pegel: ${currentPegel}`,
            font: {
                family: 'Arial, sans-serif',
                size: 15
            },
            xref: 'paper',
            x: 0.5,
            xanchor: 'center',
            y: 0.98
        },
        xaxis: { 
            rangemode: 'normal', 
            tickformat: '%d.%m.%Y %H:%M',
            tickfont: { size: 8 }, 
            range: [startXValue, lastXValue]
        },
        yaxis: { 
            title: {
                text: 'Wasserstand [cm]', 
                font: { size: 11 }
            },
            zeroline: true, 
            rangemode: 'tozero', 
            range: [0, maxYValuePlus15Percent], // Set y-axis range here
            tickformat: '.0f', 
            tickfont: { size: 10 }
        },
        legend: {
            orientation: 'v',
            x: 0.00,
            y: 1.00,
            xanchor: 'left',
            yanchor: 'top',
            font: { size: 9 },
            bgcolor: 'rgba(255,255,255,0.5)'
        },
        margin: {
            l: 40,  // left margin
            r: 10,  // right margin
            t: 20,  // top margin
            b: 25   // bottom margin
        },
        hovermode: 'x',
        shapes: horizontalLines
    };
    
    Plotly.newPlot('plotWS', [trace1, trace2], layout, { displayModeBar: false });
    showPlotWS();

    toggleZoomButton.onclick = () => { 
        Plotly.relayout('plotWS', { 
            'xaxis.range': [startXValue, lastXValue],
            'yaxis.range': [0, maxYValuePlus15Percent]
        }); 
    }; 
    
    toggleZoomButton2.onclick = () => { 
        Plotly.relayout('plotWS', { 
            'xaxis.range': [xValues_messung[0], lastXValue],
            'yaxis.range': [0, maxYValuePlus15Percent]
        }); 
    }; 
}