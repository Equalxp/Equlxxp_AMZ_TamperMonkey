// ==UserScript==
// @name         亚马逊ABA数据自动下载
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  Amazon ABA Data AutoDownload
// @author       You
// @match        https://sellercentral.amazon.co.uk/*
// @require      https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @icon         data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
// 获取元素 循环 下载
(function () {
    'use strict';
    /* global elmGetter */
    // 重写alert
    const selfAlert = window.alert
    const { toString } = Object.prototype
    window.alert = (args) => {
        let content = null
        if (toString.call(args) === "[object HTMLDocument]") {
            // document
            content = document.querySelector('*').outerHTML
        } else if (toString.call(args) === "[object Window]") {
            // window
            const obj = {}
            for (let key in window) {
                const item = window[key]
                obj[key] = item ? item.toString() : item
            }
            content = JSON.stringify(obj)
        } else if (/\[object (.*?)Element\]$/.test(toString.call(args))) {
            // 若是dom元素，则输出当前及其子元素的html
            content = args.outerHTML
        } else if (typeof args === 'object') {
            // 若是array或者object类型
            content = JSON.stringify(args)
        } else {
            content = args
        }
        selfAlert(content)
    }

    const config = {
        timeRange: ['quarterly', 'monthly', 'weekly', 'daily'],
        timeRangeYear: ['2024', '2023', '2022'],
        timeRangeQuarter: ['03-31', '06-30', '09-30', '12-31'],
        searchTerm: ['gloves', 'hair dryer']
    };

    // 查询element
    async function getElement(selector, attr, value, eventType = "change") {
        const targetElement = await elmGetter.get(selector)
        targetElement.setAttribute(attr, value);
        targetElement.dispatchEvent(new Event(eventType, { bubbles: true }));
    }
    // timeRange
    getElement('.css-6omajh .css-cyf03k #reporting-range', 'value', config.timeRange[0])
    // Year
    getElement('.css-owk1mx .css-cyf03k #quarterly-year', 'value', config.timeRangeYear[1])
    // Quarter 问题: year改变之前 Quarter先改变了后又被Year改回去了
    getElement('.css-owk1mx .css-cyf03k .css-xccmpe', 'value', config.timeRangeQuarter[0])
    // getElement(`.css-owk1mx .css-cyf03k }`, 'value', config.timeRangeQuarter[0])
    // // 循环
    // function processYearsAndQuarters(years, quarters) {
    //     // 年+季度 循环
    //     years.forEach(year => {
    //         quarters.forEach(quarter => {
    //             const quarterValue = year + "-" + quarter;
    //             // Update quarterly dropdown
    //             // 年|季度 都需要修改
    //             getElement('.css-cyf03k #reporting-range')

    //         });
    //     });
    // }
})();
// 