#1. Nested bar charts  
Source: https://blogs.sas.com/content/iml/2025/03/31/nested-bar-charts.html
```sas
data Bars;
    do Year = 2020 to 2022;
        do Quarter = 1 to 4;
            input Sales @;
            output;
        end;
    end;
datalines;
100  87  92 125
118  97 108 153
128 109 105 142
;

proc sgplot data=Bars;
    vbarbasic Year / response=Sales transparency=0.6;
    vbarbasic Year / response=Sales group=Quarter groupdisplay=cluster clusterwidth=0.8;
run;
```