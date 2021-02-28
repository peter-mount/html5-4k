// WorldMap example

const svg = d3.select("svg"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Scale of height/2.2 just fits a 4k frame but looks blocky due to the dataset.
// Scale of height/3 is smaller but looks better
const projection = d3.geoOrthographic()
  .scale(height/3)
  .translate([width / 2, height / 2])
  .precision(0.1);

const path = d3.geoPath().projection(projection);

d3.json("./world-110m.json", function (err, world) {
  svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("class","space");

  svg.append("path")
    .datum({type: "Sphere"})
    .attr("class","sphere");

  svg.append("path")
    .datum(topojson.feature(world, world.objects.land))
    .attr("class","land");

  svg.append("path")
    .datum(topojson.mesh(world, world.objects.countries, function (a, b) {
      return a !== b;
    }))
    .attr("class","border");
});

function rotateMap(rotation) {
  projection.rotate(rotation);
  svg.selectAll("path").attr("d", path);
}
