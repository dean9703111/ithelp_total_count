# 計算自己 IT 邦幫忙所有文章的瀏覽/Like/留言總數的工具

我想應該有許多 IT 邦幫忙的作者都很關心自己文章的瀏覽數，像筆者就是一個喜歡三不五時去看看自己文章增加多少瀏覽量的人；剛好有其他創作者反映希望可以透過工具取得自己所有文章的瀏覽/Like/留言總數，而不是靠計算機土法煉鋼來計算。

藉此機會筆者就研究了一下「puppeteer」這個套件的用法，再花一點時間把小工具寫出來，完整的程式碼如下：

- **main.js**

  ```js
  const puppeteer = require("puppeteer");
  require("dotenv").config();

  (async () => {
    const ithelp_url = process.env.ITHELP_URL || "https://google.com/";
    const browser = await puppeteer.launch({
      headless: process.env.HEADLESS == "false" ? false : true,
    });

    let total_likes = 0;
    let total_responses = 0;
    let total_views = 0;
    let p = 0;
    //end = false時while迴圈會中斷
    let end = true;
    const page = await browser.newPage();
    while (end) {
      p == 0 ? await page.goto(ithelp_url) : await page.goto(ithelp_url + `?page=` + p);
      await page.waitForSelector(".profile-main__title");

      let elements = await page.$$(".qa-condition__count");
      if (elements.length > 0) {
        for (var i = 0; i < elements.length; i++) {
          let tmp_text = await page.evaluate((el) => el.textContent, elements[i]);
          if (i % 3 == 0) {
            total_likes += parseInt(tmp_text);
          } else if (i % 3 == 1) {
            total_responses += parseInt(tmp_text);
          } else if (i % 3 == 2) {
            total_views += parseInt(tmp_text);
          }
        }
      } else {
        await browser.close();
        end = false;
      }
      p++;
    }
    console.log({ "toal likes": total_likes, "toal responses": total_responses, "toal views": total_views });
  })();
  ```

- **.env**
  ```sh
  # 填上自己想要爬蟲的頁面，下面是筆者個人的文章頁面喔
  ITHELP_URL=https://ithelp.ithome.com.tw/users/20103256/articles
  # 預設不開啟瀏覽器，如果你想開啟就改成false
  HEADLESS=false
  ```

大家也可以到筆者的 [Gihub](https://github.com/dean9703111/ithelp_total_count) 直接把專案 Clone 下來執行，下面是用筆者在 IT 邦幫忙文章網址的 Demo：

- 使用鐵人賽文章網址：https://ithelp.ithome.com.tw/users/20103256/ironman/4227
  ![image](./img/ironman.png)
- 使用個人文章網址：https://ithelp.ithome.com.tw/users/20103256/articles
  ![image](./img/articles.png)

### 專案使用提醒：

- 去「.env」裡面把「ITHELP_URL」改成自己的網址
- 如果你想要看到瀏覽器彈出來，去「.env」裡面把「HEADLESS」改成 false
- 記得先在終端機輸入`yarn`將套件安裝
- 在終端機輸入`yarn start`即可執行

---

感謝大家的閱讀，如果工具有幫助到你，按`STAR`⭐⭐⭐ 可以讓我更有開發小工具的動力。
