document.getElementById("last_time_updated").innerHTML = newTimeNiederschlag;
var slider = document.getElementById("myRange");
var initialValue = 23; //slider.value;
var output = document.getElementById("zeitpunkt");
var dates = ["-23:00", "-22:00", "-21:00", "-20:00", "-19:00", "-18:00", "-17:00", "-16:00", "-15:00", "-14:00", "-13:00", "-12:00", "-11:00", "-10:00", "-09:00", "-08:00", "-07:00", "-06:00", "-05:00", "-04:00", "-03:00", "-02:00", "-01:00", "±00:00", "+01:00", "+02:00", "+03:00", "+04:00", "+05:00", "+06:00", "+07:00", "+08:00", "+09:00", "+10:00", "+11:00", "+12:00"];

// this 4 variables must be correctly updated with layer names after each export with qgis2web
var layers = [layer_minus_23_40,layer_minus_22_39,layer_minus_21_38,layer_minus_20_37,layer_minus_19_36,layer_minus_18_35,layer_minus_17_34,layer_minus_16_33,layer_minus_15_32,layer_minus_14_31,layer_minus_13_30,layer_minus_12_29,layer_minus_11_28,layer_minus_10_27,layer_minus_09_26,layer_minus_08_25,layer_minus_07_24,layer_minus_06_23,layer_minus_05_22,layer_minus_04_21,layer_minus_03_20,layer_minus_02_19,layer_minus_01_18,layer_minus_00_17,layer_plus_01_16,layer_plus_02_15,layer_plus_03_14,layer_plus_04_13,layer_plus_05_12,layer_plus_06_11,layer_plus_07_10,layer_plus_08_9,layer_plus_09_8,layer_plus_10_7,layer_plus_11_6,layer_plus_12_5,];
var polygon_ezg = layer_Einzugsgebiet_42
var punkte_pegel = layer_PegelaktuelleWasserstnde_44
var punkte_abtasten = layer_RadolanPixel_41

var dec_places = 3 //in annotations on Niederschlagsdiagramm
map.addLayer(layers[23]);
output.innerHTML = dates[slider.value];
slider.oninput = function() {
output.innerHTML = dates[this.value];
layers.forEach(function(layer) {if (map.hasLayer(layer)) {map.removeLayer(layer);};});
map.addLayer(layers[this.value]);
updateLine(this.value);
};
var currentMarkerId = null;
var legendAdded = false; //logic for testing- is the Niederschlag-legend present and if yes -the way is clear for Niederschlagdiagramm

punkte_abtasten.on('click', function(e) {
// Access the clicked feature's properties
var clickedFeature = e.layer.feature;
var attributeValue = clickedFeature.properties.Punktname; // Replace 'ID' with the attribute you need
// Do something with the attribute value
//alert('Attribute Value: ' + attributeValue);
if(legendAdded){updatePlot(attributeValue)};
});
//cumulative sum of the array
function cumulativeSum(arr, idx) { 
    const cumSumArray = []; 
    let cumSum = 0; 
    for (let i = 0; i <= idx && i < arr.length; i++) { 
    cumSum += arr[i]; 
    cumSumArray.push(cumSum); } 
    return cumSumArray; }
//showing the plot values in annotattion box based on slider position and selected abtastpunkt
function hovertext(sliderValue, punkt_id) {
    let xPosition = sliderValue;
    let cumsum_prognose = cumulativeSum(Object.values(prognose_plot[punkt_id]), sliderValue-24);
    let cumsum_archiv = cumulativeSum(Object.values(archiv_plot[punkt_id]), sliderValue);
    console.log('cumsum value:', cumsum_archiv);
    console.log('xPosition:', xPosition);
    console.log('slider:', slider.value);
    if (xPosition <= 23) {
        //hoverText = '11';
        hoverText = `${dates[xPosition]}<br>Archiv: ${archiv_plot[punkt_id][xPosition].toFixed(dec_places)}<br>Summe: ${cumsum_archiv.pop().toFixed(dec_places)}`
    }
    else {
        //hoverText= '22'
        hoverText = `${dates[xPosition]}<br>Prognose: ${prognose_plot[punkt_id][xPosition-24].toFixed(dec_places)}<br>Summe: ${cumsum_prognose.pop().toFixed(dec_places)}`
    };
    
    

    const layoutUpdate = {
        annotations: [{
            x: xPosition,
            y: 0.8, // Adjust y position as necessary
            xref: 'x',
            yref: 'paper',
            text: hoverText,
            showarrow: false,
            font: {
                family: 'Arial, sans-serif',
                size: 10,
                color: 'black'
            },
            bgcolor: 'white',
            bordercolor: 'black',
            borderwidth: 1,
            align: 'left',
        }],
    };

    // Loop through traces to set hover text
    Plotly.relayout('plot', layoutUpdate);

    // Extract y-values for hover trace based on slider value
    const traceData = Plotly.d3.selectAll('.plotly .scatterlayer .trace').data();
    if (traceData.length > 0) {
        const yValue = traceData[0].y[sliderValue];
        console.log('yValue:', yValue);
        console.log('traceData:', traceData);
        const hoverTrace = {
            x: [xPosition],
            y: traceData[0].y[sliderValue], // Example to get the y-value of the first trace
            
            mode: 'markers+text',
            text: hoverText,
            textposition: 'top center',
            marker: {color: 'rgba(255,0,0,0.5)', size: 10},
            showlegend: false,
            hoverinfo: 'text'
        };

        // Remove previous hover trace
        Plotly.deleteTraces('plot', -1);

        // Add new hover trace
        Plotly.addTraces('plot', [hoverTrace]);
    }
}


// Update hover text when slider input changes
slider.oninput = function() {
    output.innerHTML = dates[this.value];
    layers.forEach(function(layer) { if (map.hasLayer(layer)) { map.removeLayer(layer); }});
    map.addLayer(layers[this.value]);
    document.getElementById('buttonInfo').innerHTML = "";
    if (this.value >= 0){
        updateLine(this.value); 
    };
    
    hovertext(this.value, currentMarkerId);
};



//*/

function updateLine(value) {
console.log('Updating line with value:', value);
initialValue = value
//console.log('slider value:', initialValue);
if (value>=0) {    
        Plotly.relayout('plot', {
        'shapes[0].x0': value,
        'shapes[0].x1': value
})};
}
            
function updatePlot(markerId) {
    console.log('Updating plot with marker ID:', markerId);
    currentMarkerId = markerId;
    const barValues = Object.values(archiv_plot[markerId]);
    const cumulativeSum = barValues.reduce((acc, val) => {
        acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + val);
        return acc;
    }, []);
    const barValues_prognose = Object.values(prognose_plot[markerId]);
    const cumulativeSum_prognose = barValues_prognose.reduce((acc, val) => {
        acc.push((acc.length > 0 ? acc[acc.length - 1] : 0) + val);
        return acc;
    }, []);

            const xListe = ['-23h', '-22h', '-21h', '-20h', '-19h', '-18h', '-17h', '-16h', '-15h', '-14h', '-13h', '-12h', '-11h', '-10h', '-09h', '-08h', '-07h', '-06h', '-05h', '-04h', '-03h', '-02h', '-01h', '±00h', '+01h', '+02h', '+03h', '+04h', '+05h', '+06h', '+07h', '+08h', '+09h', '+10h', '+11h', '+12h'];

            const trace1 = {
                x: xListe.slice(0, 24),
                y: barValues,
                type: 'bar',
                name: 'Archiv',
                opacity: 0.5,
                yaxis: 'y1'
            };
            
            const trace2 = {
                x: xListe.slice(0, 24),
                y: cumulativeSum,
                mode: 'lines',
                name: 'Summe',
                yaxis: 'y2',
                line:{color: '#6d6af2'}
            };
            
            const trace3 = {
                x: xListe.slice(24, 36),
                y: barValues_prognose,
                type: 'bar',
                name: 'Prognose',
                opacity: 0.5,
                yaxis: 'y1',
                marker:{
                color: '#fcbba1' // Lighter shade of magenta
                }
            };
            
            const trace4 = {
                x: xListe.slice(24, 36),
                y: cumulativeSum_prognose,
                mode: 'lines',
                name: 'Summe',
                yaxis: 'y2',
                line:{color: '#e84f7a'}
            };

            const layout = {
                title: {
                    text: `Abtastpunkt: ${markerId}`,
                    font:{
                        family: 'Arial, sans-serif',
                        size: 12
                    },
                    xref: 'paper',
                    x: 0.5,
                    xanchor: 'center',
                    y: 0.98
                },
                xaxis: {
                    rangemode: 'normal', 
                    title:{
                        font: {size:7},
                        },
                    tickfont: {size:6},
                },
                yaxis: { 
                    title: {
                        text:'Niederschlag [mm]', 
                        font: {size:7},
                        },
                    zeroline: true, 
                    rangemode: 'tozero', 
                    autorange: true, 
                    tickformat: '.2f',
                    tickfont: {size:6},
                },
                yaxis2: {
                    title: {
                        text:'Summe [mm]',
                        font: {size:7},
                        },
                    zeroline: true,
                    rangemode: 'tozero',
                    autorange: true, // Adjust the range to ensure it starts from 0
                    tickformat: '.2f', // Restrict to 2 decimal places
                    overlaying: 'y',
                    side: 'right',
                    tickfont: {size:6},
                },
                shapes: [{
                    type: 'line',
                    xref: 'x',
                    yref: 'paper',
                    x0: initialValue,
                    y0: 0,
                    x1: initialValue,
                    y1: 1,
                    line: {
                        color: '#e800cd',
                        width: 2,
                        dash: 'dash'
                    }
                }],
                legend: {
                    orientation: 'v',
                    x: 0.00,
                    y: 1.00,
                    xanchor: 'left',
                    yanchor: 'top',
                    font: {size:9},
                    bgcolor: 'rgba(255,255,255,0.5)'
                    },
                bargap: 0,
                margin: {
                    l: 25,  // left margin
                    r: 25,  // right margin
                    t: 20,  // top margin
                    b: 20   // bottom margin
                    },
                hovermode: 'x'
            };

            Plotly.newPlot('plot', [trace1, trace2, trace3, trace4], layout, {displayModeBar: false});
            showPlot();
            hovertext(slider.value, currentMarkerId);

}

//custom legend to the bottomleft
function getColor_Radolan(d) {
    return d > 50   ?  '#7e0000':
           d > 20   ?  '#7e0000':
           d > 10   ?  '#ff3ace':
           d > 5    ?  '#e6a6f2':
           d > 2    ?  '#5b36ff':
           d > 1    ?  '#73bbe5':
           d > 0.5  ?  '#18ff00':
           d > 0    ?  '#efff00':
                       '#f1f1bb';
}

function getColor_Icon(d) {
    return d > 50   ? '#67000d' :
           d > 20   ? '#67000d' :
           d > 10   ? '#ad1117' :
           d > 5    ? '#d32020' :
           d > 2    ? '#f14432' :
           d > 1    ? '#fb7050' :
           d > 0.5  ? '#fc9777' :
           d > 0    ? '#fcbea5' :
                      '#fee1d3';
}

var legend = L.control({position: 'bottomleft'});

legend.onAdd = function (map) {
    legendAdded = true;
    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 0.5, 1, 2, 5, 10, 20, 50],
        labels = [];
    
    div.innerHTML += '<p>Niederschlag-DWD</p>';
    div.innerHTML += '<p>Archiv (Radolan)<br>[mm/h]</p>'; // Add first subtitle here

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor_Radolan(grades[i]) + '"></i> ' +
            (grades[i + 1] ? grades[i] + '–' + grades[i + 1] + '<br>' : '> 50');
    }

    div.innerHTML += '<p>Prognose (ICON)<br> [mm/h]</p>'; // Add second subtitle here

    // Add additional color boxes
    for (var j = 0; j < grades.length; j++) {
        div.innerHTML +=
            '<i style="background:' + getColor_Icon(grades[j]) + '"></i> ' +
            (grades[j + 1] ? grades[j] + '–' + grades[j + 1] + '<br>' : '> 50');
    }

    // Replace the last '>' with '>50'
    div.innerHTML = div.innerHTML.replace('>50<br>', '>50');

    return div;
};

legend.addTo(map);

// Function to highlight feature
function highlightFeature(e) {
    var layer = e.target;
    var attributeValue = layer.feature.properties.Intern_Bez; // Replace 'Intern_Bez' with your attribute name
    layer.setStyle({
        weight: 3,
        color: '#f0b318',
        dashArray: '',
        fillOpacity: 0.7
    });

    // Highlight corresponding polygon layer
    polygon_ezg.eachLayer(function (polygon) {
        if (polygon.feature.properties.Pegel === attributeValue) { // Replace 'Pegel' with your attribute name
            polygon.setStyle({
                weight: 3,
                color: '#f0b318',
                dashArray: '',
                fillOpacity: 0.7
            });
        }
    });
}

// Function to reset highlight
function resetHighlight(e) {
    punkte_pegel.resetStyle(e.target);

    // Reset corresponding polygon layer
    polygon_ezg.eachLayer(function (polygon) {
        polygon_ezg.resetStyle(polygon);
    });
}

// Add event listeners to point layer
punkte_pegel.eachLayer(function (layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight
    });
});