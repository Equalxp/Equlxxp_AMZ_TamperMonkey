var rows = document.querySelectorAll(".css-1o325lx")  //这里需要更换成你的类数据，找到随便一个关键词后的class替换掉
var dat = document.querySelectorAll(".css-10urxj0")
var jsonData = [];
            let str = `搜索查询词条,搜索查询分数,搜索查询数量,总数,品牌数量,品牌占有率,总数,点击率,品牌数量,品牌占有率,配送速度当日达,总数,加入购物车率,品牌数量,品牌占有率,配送速度当日达,总数,3 个月内所有购买的,品牌数量,品牌占有率,配送速度当日达\n`;
      for(let i = 0 ; i < rows.length ; i++ ){
          jsonData.push({
        'ST':rows[i].innerText.replaceAll(/,/g, ''),
        'STSCORE':dat[i*20].innerText.replaceAll(/,/g, ''),
        'STNUM':dat[i*20+1].innerText.replaceAll(/,/g, ''),
        'TOTL1':dat[i*20+2].innerText.replaceAll(/,/g, ''),
        'BR1':dat[i*20+3].innerText.replaceAll(/,/g, ''),
        'BRA1':dat[i*20+4].innerText.replaceAll(/,/g, ''),
        'TOTAL2':dat[i*20+5].innerText.replaceAll(/,/g, ''),
        'CLICK1':dat[i*20+6].innerText.replaceAll(/,/g, ''),
        'BR2':dat[i*20+7].innerText.replaceAll(/,/g, ''),
        'BRA2':dat[i*20+8].innerText.replaceAll(/,/g, ''),
        'DL1':dat[i*20+9].innerText.replaceAll(/,/g, ''),
        'TOTAL3':dat[i*20+10].innerText.replaceAll(/,/g, ''),
        'ADD1':dat[i*20+11].innerText.replaceAll(/,/g, ''),
        'BR3':dat[i*20+12].innerText.replaceAll(/,/g, ''),
        'BRA3':dat[i*20+13].innerText.replaceAll(/,/g, ''),
        'DL2':dat[i*20+14].innerText.replaceAll(/,/g, ''),
        'TOITAL4':dat[i*20+15].innerText.replaceAll(/,/g, ''),
        'B3':dat[i*20+16].innerText.replaceAll(/,/g, ''),
        'BR4':dat[i*20+17].innerText.replaceAll(/,/g, ''),
        'BRA4':dat[i*20+18].innerText.replaceAll(/,/g, ''),
        'DL3':dat[i*20+19].innerText.replaceAll(/,/g, ''),
        });
        for(let item in jsonData[i]){
            str+=`${jsonData[i][item] + '\t'},`;     
        }
        str+='\n';
      }
      let uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
      var link = document.createElement("a");
      link.href = uri;
link.download =  "ABA搜索查询数据表.csv";
      document.body.appendChild(link);
link.click();
      document.body.removeChild(link);