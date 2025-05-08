// ==UserScript==
// @name         亚马逊ABA数据自动下载
// @namespace    http://tampermonkey.net/
// @version      2024-12-23
// @description  try to take over the world!
// @author       You
// @match        https://sellercentral.amazon.co.uk/*
// @require      https://scriptcat.org/lib/513/2.0.1/ElementGetter.js#sha256=V0EUYIfbOrr63nT8+W7BP1xEmWcumTLWu2PXFJHh5dg=
// @icon         data:image/gifbase64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==
// 获取元素 循环 下载
(function () {
    'use strict';

    const config = {
        timeRange: ['quarterly', 'monthly', 'weekly', 'daily'],
        timeRangeYear: ['2024', '2023'],
        timeRangeQuarter: ['03-31', '06-30', '09-30', '12-31'],
        searchTerm: ['gloves', 'hair dryer']
    };

    // 异步版 checkObj，返回 Promise
    function checkObjAsync(selector, timeInterval) {
        return new Promise((resolve, reject) => {
            const start = Date.now();
            // 设置超时时间 10 秒
            const timeout = 10000;
            let t = setInterval(() => {
                const targetElement = document.querySelector(selector);
                if (targetElement) {
                    clearInterval(t);
                    resolve(targetElement);
                } else if (Date.now() - start > timeout) {
                    clearInterval(t);
                    reject(new Error(`Timeout: Element not found for selector "${selector}"`));
                }
            }, timeInterval);
        });
    }

    // 修改属性 & 触发事件
    function setAttrAndDispatchEv(obj, attr, value, eventType = "change") {
        obj.setAttribute(attr, value);
        obj.dispatchEvent(new Event(eventType, { bubbles: true }));
    }

    // 模拟点击事件
    async function clickEvent() {
        try {
            // search await——同步执行
            const obj1 = await checkObjAsync(".css-1oy4rvw", 1000);
            // obj1.setAttribute("label", "点击1-应用");
            setTimeout(() => {
                obj1.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 1000);

            // download-1 & download-2
            const downloadButtons = [
                ".css-1bvc4cc #GenerateDownloadButton",
                ".css-ivrut9 .css-ja60r3 .css-1nln1ln"
            ];
            for (const selector of downloadButtons) {
                const obj = await checkObjAsync(selector, 1000);
                // download click
                setTimeout(() => {
                    obj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
                }, 1000);
            }

            // close dialog
            const closeObj = await checkObjAsync(".css-ivrut9 .css-ja60r3 kat-button", 1000);
            setTimeout(() => {
                closeObj.dispatchEvent(new Event("click", { bubbles: true, cancelable: false }));
            }, 2000);
        } catch (error) {
            console.error("Error in clickEvent:", error.message);
        }
    }

    // 处理年份和季度
    async function processYearsAndQuarters(years, quarters) {
        try {
            const timeRangeObj = await checkObjAsync(".css-cyf03k #reporting-range", 1000);
            setAttrAndDispatchEv(timeRangeObj, 'value', config.timeRange[0]);

            for (const year of years) {
                const yearObj = await checkObjAsync(".css-cyf03k #quarterly-year", 1000);
                setAttrAndDispatchEv(yearObj, 'value', year);

                for (const quarter of quarters) {
                    const quarterValue = `${year}-${quarter}`;
                    alert(quarterValue);

                    const quarterObj = await checkObjAsync(".css-owk1mx .css-cyf03k .css-xccmpe", 1000);
                    setAttrAndDispatchEv(quarterObj, 'value', quarterValue);

                    // 每次循环独立执行 clickEvent
                    await clickEvent();
                }
            }
        } catch (error) {
            console.error("Error in processYearsAndQuarters:", error.message);
        }
    }

    // 执行处理逻辑
    processYearsAndQuarters(config.timeRangeYear, config.timeRangeQuarter);

})();

