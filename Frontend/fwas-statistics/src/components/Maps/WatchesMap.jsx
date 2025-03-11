import { useLayoutEffect ,useEffect, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated"
import am5geodata_usaLow from "@amcharts/amcharts5-geodata/usaHigh";
import ofline from './cities.json'
export default function WatchesMap(){
    var [map_locs,SetALocs] = useState(ofline)
      useEffect(()=>{
        get_alert_locs()
      },[])
      
      async function get_alert_locs(){
        let api = await fetch(import.meta.env.VITE_API+"/alerts_locations")
        let alert_locs = await api.json()
        SetALocs(alert_locs) 
      }
    useLayoutEffect(() => {
        am5.ready(function() {
            const root = am5.Root.new("chartdiv");
            root.setThemes([am5themes_Animated.new(root)]);
            var chart = root.container.children.push(am5map.MapChart.new(root, {panX: "rotateX",panY: "translateY",projection: am5map.geoAlbersUsa(),}));
            var zoomControl = chart.set("zoomControl", am5map.ZoomControl.new(root, {}));
            zoomControl.homeButton.set("visible", true);
            var polygonSeries = chart.series.push(am5map.MapPolygonSeries.new(root, {geoJSON: am5geodata_usaLow,exclude: ["AQ"]}));
            polygonSeries.mapPolygons.template.setAll({fill:am5.color(0xdadada)});
            var pointSeries = chart.series.push(am5map.ClusteredPointSeries.new(root, {}));
            pointSeries.set("clusteredBullet", function(root) {
                var container = am5.Container.new(root, {cursorOverStyle:"pointer"});
                var circle1 = container.children.push(am5.Circle.new(root, {radius: 8,tooltipY: 0,fill: am5.color(0xff8c00)}));
                var circle2 = container.children.push(am5.Circle.new(root, {radius: 12,fillOpacity: 0.3,tooltipY: 0,fill: am5.color(0xff8c00)}));
                var circle3 = container.children.push(am5.Circle.new(root, {radius: 16,fillOpacity: 0.3,tooltipY: 0,fill: am5.color(0xff8c00) }));
                var label = container.children.push(am5.Label.new(root, {centerX: am5.p50,centerY: am5.p50,fill: am5.color(0xffffff),populateText: true,fontSize: "8",text: "{value}"}));
                container.events.on("click", function(e) {  pointSeries.zoomToCluster(e.target.dataItem);});
                return am5.Bullet.new(root, {  sprite: container});
            });
            pointSeries.bullets.push(function() {
              var circle = am5.Circle.new(root, {radius: 6,tooltipY: 0,fill: am5.color(0xff8c00),tooltipText: "{title}"});
              return am5.Bullet.new(root, {sprite: circle});
            });
            for (var i = 0; i < map_locs.length; i++) {
              var city = map_locs[i];
              addCity(city.longitude, city.latitude, city.title);
            }
            function addCity(longitude, latitude, title) { pointSeries.data.push({geometry: { type: "Point", coordinates: [longitude, latitude] },title: title });}
            chart.appear(1000, 100);
            }); 
            return()=> root.dispose();
    },[])
    return (
        <></>
        // <div id="chartdiv"></div>
    );

}