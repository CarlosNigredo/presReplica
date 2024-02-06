// https://observablehq.com/@abebrath/multivariate-labelled-cartogram@1824
import define1 from "./a33468b95d0b15b0@817.js";
import define2 from "./e93997d5089d7165@2303.js";

function _1(md){return(
md``
)}

function _2(md){return(
md``
)}

function _3(html){return(
html`<h1 class=title>GLOBAL ECONOMY in 2010</h1>`
)}

function _state(checkbox){return(
checkbox({
  options: [
    { value: "map",    label: " Toggle Cartogram/Mercator" },
    { value: "weight", label: "Text Weight" },
    { value: "space",  label: "Text Spacing" },
    { value: "slope",  label: "Text Sloping" },
    { value: "color",  label: "Text Color" },
  ],
  value: ["map", "weight", "space", "slope", "color"],
  //submit: false
})
)}

function _5(swatches,regionScale){return(
swatches({color: regionScale})
)}

async function* _chart(d3,width,height,mapHeight,FileAttachment,mapData,rowScale,colScale,countryData,inflationScale,gdpFontScale,gdpPctScale,regionScale,numberWithCommas,gdpLegend,gdpPctLegend,inflationLegend)
{
  const svg = d3.create("svg")
    .attr("viewBox", [0, 0, width, height])

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", "svgBackground");
  
  //attaching the standard mercator map as a .jpg
  svg.append("image")
    .attr("width", "100%")
    .attr("height", mapHeight)
    .attr("xlink:href", await FileAttachment("worldMap.JPG").url());
  
  //a blue rectangle - water for the cartogram
  svg.append("rect")
    .attr("class", "cartogram")
    .attr("width", "100%")
    .attr("height", mapHeight)
    .attr("fill","#bbe4ed");
  
  //brown rectangles - landmass for the cartogram 
  svg.append("g")
    .selectAll("rect#land")
    .data(mapData)
    .join("rect")
      .attr("id", "land")
      .attr("class", "cartogram")
      .attr("fill","#daccbc")
      .attr("stroke","#eadccc")
      .attr("height", rowScale(1))
      .attr("width", colScale(1))
      .attr("x", d => colScale(d.Y) - colScale(0.5))
      .attr("y", d => rowScale(d.X) - rowScale(0.5));
  
  //white rectangles - islands and bins to hold the text labels for the cartogram
  svg.append("g")
    .selectAll("rect#boxes")
    .data(countryData)
    .join("rect")
      .attr("id", "boxes")
      .attr("class", "cartogram")
      .attr("fill", "white")
      .attr("width", colScale(1)-4)
      .attr("height", rowScale(1)-4)
      .attr("x", d => colScale(d.Col)-colScale(.5) + 2)
      .attr("y", d => rowScale(d.Row)-rowScale(.5) + 2);
  
//text labels initalized with every variable text property - skew, weight, spacing, colour, xy location
  let labels = svg.append("g")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .attr("font-family", "Roboto")
    .selectAll("text")
    .data(countryData)
    .join("text")
      .attr("id", "label")
      .attr("x", d => colScale(d.Col) + 1)
      .attr("y", d => rowScale(d.Row) + 4)
      .attr("transform-origin", d => (colScale(d.Col) + 1) + " " + (rowScale(d.Row) + 4))
      .attr("transform", d => `skewX(${inflationScale(d.Inflation)})`)
      .attr("font-weight",    d => gdpFontScale(d.GDPperCapita))
      .attr("letter-spacing", d => gdpPctScale(d.PctGDPgrowth))
      .attr("fill", d => regionScale(d.Continent))
    .text(d => d.CountryCode)
      .append("title").text(d => d.CountryCode + " " + d.ShortName + 
                       "\n " + numberWithCommas(d.GDPperCapita.toFixed(0)) + " GDP per capita (USD)" +
                       "\n " + d.Inflation.toFixed(1)    + " Inflation (%)  "   +
                       "\n " + d.PctGDPgrowth.toFixed(1) + " GDP growth (%) "  );
  
  yield svg.node(); ////// end of main code here //////
  
  ///### TITLE AND LEGEND ###///  
  const dataSourceTag = svg.append("a")
      .attr("href", "https://data.worldbank.org")
  .append("text")
      .attr("class", "other")
      .attr("x", 680)
      .attr("y", mapHeight + 20)
      .style("font-size", "14px")
      .text("Data source: data.worldbank.org, Aug. 2013")  
  
  const legend1 = svg.append("g")
      .attr("transform", `translate(10, ${mapHeight + 20})`)
      .attr("class", "other")
      .style("font-size", "16px");
  legend1.append("text")
      .text("GDP per Capita (USD)")
      .attr("font-weight", 700);
  legend1.selectAll("text#legend1")
        .data(gdpLegend)
        .join("text")
        .text(d => d.text)
        .attr("font-family","Roboto")
        .attr("y", (d, i) => `${i * 1.5 + 1.75}em`)
        .attr("font-weight", d => d.value)
  
  const legend2 = svg.append("g")
      .attr("transform", `translate(210, ${mapHeight + 20})`)
      .attr("class", "other")
      .style("font-size", "16px");
  legend2.append("text")
      .text("Percent GDP Growth")
      .attr("font-weight", 700);
  legend2.selectAll("text#legend2")
        .data(gdpPctLegend)
        .join("text")
        .text(d => d.text)
        .attr("y", (d, i) => `${i * 1.5 + 1.75}em`)
        .attr("letter-spacing", d => d.value)
  
  const legend3 = svg.append("g")
      .attr("transform", `translate(500, ${mapHeight + 20})`)
      .attr("class", "other")
      .style("font-size", "16px");
  legend3.append("text")
      .text("Inflation")
      .attr("font-weight", 700);
  legend3.selectAll("text#legend3")
        .data(inflationLegend)
        .join("text")
        .text(d => d.text)
        .attr("y", (d, i) => `${i * 1.2 + 1.75}em`)
        .attr("transform-origin", (d, i) => `10 ${i * 22.5 + 1.75}`)
        .attr("transform", d =>  `skewX(${d.value})`)
  ///### * end * title+  legend ###///
}


function _7(md){return(
md`## Data and Functions`
)}

async function _countryData(FileAttachment,d3)
{
  //the JSON data has many unneeded values, this script loads the file and and converts to required datatypes
  const data = await FileAttachment("WorldBankStats2010@2.json").json()

  return d3.range(data.length).map(function(d) { 
    return {//Year: "2010"
            //YearCode: "YR2010"
            //FullName: "Albania"
            CountryCode: data[d].CountryCode,
            ShortName: data[d].ShortName,
            //AvgLong: "65.00"
            Row: +data[d].Row,
            Col: +data[d].Col,
            Region: data[d].Region,
            Continent: data[d].Continent,
            Population: +data[d].Population,
            //PercentFemale: "49.92341503"
            //LifeExpectancy: "76.90095122"
            Inflation: +data[d].Inflation,
            //HealthSpendPctGDP: "6.547297762"
            GDPperCapita: +data[d].GDPperCapita,
            PctGDPgrowth: +data[d].PctGDPgrowth,
            TradeBalance: +data[d].TradeBalance,
            //PctEmploy: "51.79999924"
            //PctChildEmployment: ""
            //GovtDebt: ""
            //PopOver65: "9.658975297"
            //PctHIV: ""
            Long: (+data[d].Long > -169.2)? +data[d].Long : +360 - Math.abs(data[d].Long), // see lonScale below
            Lat: +data[d].Lat
            }
})}


async function _mapData(FileAttachment,d3)
{
  const data = await FileAttachment("landGrid@2.json").json()

  return d3.range(data.length).map(function(d) { 
    return { X: +data[d].X, Y: +data[d].Y }
})}


function _ui_update(d3,state,gdpPctScale,regionScale,gdpFontScale,colScale,lonScale,rowScale,latScale,inflationScale)
{
  // text label attributes changing
  d3.selectAll("text#label")
    .each(function(d){  
            d3.select(this)
              .transition()
              .duration(200)
              .attr("letter-spacing", d => state.includes("space")? gdpPctScale(d.PctGDPgrowth) : "normal")
              .attr("fill",           d => state.includes("color")? regionScale(d.Continent) : "black")
              .attr("font-weight",    d => state.includes("weight")? gdpFontScale(d.GDPperCapita) : 300)
              .attr("x", d => state.includes("map")? colScale(d.Col) + 1 : lonScale(d.Long))
              .attr("y", d => state.includes("map")? rowScale(d.Row) + 4 : latScale(d.Lat))
              .attr("transform-origin", d =>
                     state.includes("map")? 
                       `${colScale(d.Col) + 1} ${rowScale(d.Row) + 4}` :
                       `${lonScale(d.Long)} ${latScale(d.Lat)}`)
              .attr("transform", d => 
                     state.includes("slope")? 
                       `skewX(${inflationScale(d.Inflation)})` :
                       "skewX(0)")
  })
  // cartogram attributes (rectangles) hiding and showing
  d3.selectAll("rect.cartogram")
    .each(function(d){
        d3.select(this)
          .transition()
          .duration(200)
          .attr("fill-opacity",   state.includes("map")? 1 : 0)
          .attr("stroke-opacity", state.includes("map")? 1 : 0)
  })
}


function _11(md){return(
md`## Scales, Axes and Legends`
)}

function _rowScale(d3,mapData,mapHeight){return(
d3.scaleLinear()
        .domain([d3.min(mapData, d => d.X) - 1, d3.max(mapData, d => d.X) + 1])
        .range([0, mapHeight])
)}

function _colScale(d3,mapData,width){return(
d3.scaleLinear()
        .domain([d3.min(mapData, d => d.Y) - 1, d3.max(mapData, d => d.Y) + 1])
        .range([0, width])
)}

function _latScale(d3,mapHeight){return(
d3.scaleLinear()
  .domain([-90, 90])
  .range([mapHeight, 0])
)}

function _lonScale(d3,width){return(
d3.scaleLinear()
    .domain([-169.2, (180 + 10.2)])
    .range([0, width])
)}

function _gdpFontScale(d3){return(
d3.scaleThreshold()
    .domain([1, 500, 2000, 10000])
    .range([100, 300, 500, 700, 900])
)}

function _gdpLegend(gdpFontScale)
{ 
  var array = gdpFontScale.domain().map(function(d, i, self){ 
                 if (i == 0) {return `Less than $${self[i + 1]}`}
                 else if (i == self.length - 1) {return `More than $${d}`}
                 else {return `$${d} - $${self[i + 1]}`}
  })
  array.unshift("Undefined")
  var obj = array.map(function(d, i){return {"value": gdpFontScale.range()[i], "text": d}})
  return obj;
}


function _inflationScale(d3){return(
d3.scaleThreshold()
  .domain([0, 2, 5, 10, 20])
  .range([15,0,-5,-10,-20,-30])
)}

function _inflationLegend(inflationScale)
{
  var array = inflationScale.domain().map(function(d, i, self){ 
                 if (i == self.length - 1) {return `More than ${d}.0 %`}
                 else {return `${d}.0 - ${self[i + 1]}.0 %`}
  })
  array.unshift("Negative")
  var obj = array.map(function(d, i){return {"value": inflationScale.range()[i], "text": d}})
  return obj;
}


function _gdpPctScale(d3){return(
d3.scaleThreshold()
  .domain([0,2,5,10])
  .range(["-.1em","0",".1em",".25em",".5em"])
)}

function _gdpPctLegend(gdpPctScale)
{
  var array = gdpPctScale.domain().map(function(d, i, self){ 
                 if (i == self.length - 1) {return `More than ${d}.0 %`}
                 else {return `${d}.0 - ${self[i + 1]}.0 %`}
  })
  array.unshift("Negative")
  var obj = array.map(function(d, i){return {"value": gdpPctScale.range()[i], "text": d}})
  return obj;
}


function _regionScale(d3,countryData){return(
d3.scaleOrdinal()
  .domain(countryData.map(d => d.Continent)                 //get an array of all the continents
                     .filter(function(value, index, self) { //filter that array down to only the distinct values
                        return self.indexOf(value) === index;
  }))
  .range(d3.schemeCategory10)
)}

function _numberWithCommas(){return(
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
)}

function _24(md){return(
md `## Appendix`
)}

function _d3(require){return(
require("d3@5")
)}

function _margin(){return(
{top: 50, right: 20, bottom: 35, left: 40}
)}

function _mapHeight(height){return(
height * 0.75
)}

function _height(){return(
640
)}

function _width(){return(
960
)}

function _32(html){return(
html` 
<link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;500;700;900&display=swap" rel="stylesheet">
<style>
  * {
    color: var(--black);
  }
  .svgBackground {fill: #fffbeb;}

  .title {
       font: 24px "Lato", sans-serif;
	     fill: #263c54;
	     font-weight: 700;
  }

  .other {
         font: 20px "Lato", sans-serif;
         fill: #263c54;
         font-weight: 400;
    }
</style>`
)}

function _33(md){return(
md`## Notes and Further Exploration`
)}

function _34(md){return(
md`[Cartograms](https://en.wikipedia.org/wiki/Cartogram) adjust the map layout to fit data. Many cartograms adjust size based on the quantitative value, resulting in highly-distorted geographic shapes. Dangers of adjusting map boundaries based on quantitative data, include: creating unrecognizable distorted shapes; potential to visibility of regions with values near zero; inability to show negative values; and so on. The typographic cartogram above adjusts layout to fit labels, then the labels convey the data. Small countries such as Singapore are still visible. 

The data is from OECD, using data from 2010, shortly after the financial crisis of 2008, so that some of the stresses in global economics are clearly visible (e.g. Ireland). The interactive technique shows how different variables could be layered in. 

There are many potential areas of enhancement that could be considered, for example, how could regions within a country be shown? Or, perhaps, how could a city-level representations be made: the bay area of the US was impacted differently than New York City, Milan was impacted differently than Naples. 

Another significant issue is data availablity: some regions do not report the same values or do not report values at all: in this particular example null values have been set to zero which mis-represents the data. For GDP, null appears as a very lightweight font, but perceptually that may be misunderstood as low GDP. With null inflation set to zero, the country is mis-represented as zero. Thus, while places such as Andorra and West Bank are visible, they are not properly represented.`
)}

export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["WorldBankStats2010@2.json", {url: new URL("./files/c393e01ee297674f894d095b3766b783823da45098870adf216caf0652ba530abb7d3f2a848ccecdab83927a3b85fb51249e2a42427b3eb8ff6a50851fc797d0.json", import.meta.url), mimeType: "application/json", toString}],
    ["landGrid@2.json", {url: new URL("./files/a5fbbb3b80a4ca94bda2df0474f7fcd50471b4bc4bbcc31819b96e1f601b85a21d10698b539f6beccf94fa17ecc8fb059ff06b09ae1cbfb214e906db1cd678ff.json", import.meta.url), mimeType: "application/json", toString}],
    ["worldMap.JPG", {url: new URL("./files/6b4f34f0a9fb38890311502f2cb768536aefa73980f92b1af368af6661c6d72390580e93810c397fc208de1abb1829221f7a530fd29af4567f010a263c852110.jpeg", import.meta.url), mimeType: "image/jpeg", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], _1);
  main.variable(observer()).define(["md"], _2);
  main.variable(observer()).define(["html"], _3);
  main.variable(observer("viewof state")).define("viewof state", ["checkbox"], _state);
  main.variable(observer("state")).define("state", ["Generators", "viewof state"], (G, _) => G.input(_));
  main.variable(observer()).define(["swatches","regionScale"], _5);
  main.variable(observer("chart")).define("chart", ["d3","width","height","mapHeight","FileAttachment","mapData","rowScale","colScale","countryData","inflationScale","gdpFontScale","gdpPctScale","regionScale","numberWithCommas","gdpLegend","gdpPctLegend","inflationLegend"], _chart);
  main.variable(observer()).define(["md"], _7);
  main.variable(observer("countryData")).define("countryData", ["FileAttachment","d3"], _countryData);
  main.variable(observer("mapData")).define("mapData", ["FileAttachment","d3"], _mapData);
  main.variable(observer("ui_update")).define("ui_update", ["d3","state","gdpPctScale","regionScale","gdpFontScale","colScale","lonScale","rowScale","latScale","inflationScale"], _ui_update);
  main.variable(observer()).define(["md"], _11);
  main.variable(observer("rowScale")).define("rowScale", ["d3","mapData","mapHeight"], _rowScale);
  main.variable(observer("colScale")).define("colScale", ["d3","mapData","width"], _colScale);
  main.variable(observer("latScale")).define("latScale", ["d3","mapHeight"], _latScale);
  main.variable(observer("lonScale")).define("lonScale", ["d3","width"], _lonScale);
  main.variable(observer("gdpFontScale")).define("gdpFontScale", ["d3"], _gdpFontScale);
  main.variable(observer("gdpLegend")).define("gdpLegend", ["gdpFontScale"], _gdpLegend);
  main.variable(observer("inflationScale")).define("inflationScale", ["d3"], _inflationScale);
  main.variable(observer("inflationLegend")).define("inflationLegend", ["inflationScale"], _inflationLegend);
  main.variable(observer("gdpPctScale")).define("gdpPctScale", ["d3"], _gdpPctScale);
  main.variable(observer("gdpPctLegend")).define("gdpPctLegend", ["gdpPctScale"], _gdpPctLegend);
  main.variable(observer("regionScale")).define("regionScale", ["d3","countryData"], _regionScale);
  main.variable(observer("numberWithCommas")).define("numberWithCommas", _numberWithCommas);
  main.variable(observer()).define(["md"], _24);
  main.variable(observer("d3")).define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("swatches", child1);
  const child2 = runtime.module(define2);
  main.import("checkbox", child2);
  main.variable(observer("margin")).define("margin", _margin);
  main.variable(observer("mapHeight")).define("mapHeight", ["height"], _mapHeight);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer()).define(["html"], _32);
  main.variable(observer()).define(["md"], _33);
  main.variable(observer()).define(["md"], _34);
  return main;
}
