import "materialize-css/dist/css/materialize.css";
import "materialize-css/dist/js/materialize.js";
import "./main.css";
import classnames from "classnames";
import fetch from "isomorphic-fetch";
import soundcloudLogo from "./img/soundclound.png";

const KEY_ENTER = 13;
document.addEventListener("DOMContentLoaded", function (event) {
  const searchTxt = document.getElementById("searchTxt");
  const keywordSpan = document.getElementById("keywordSpan");
  searchTxt.addEventListener("keypress", (ev) => {
    if (ev.which === KEY_ENTER) {
      const keyword = ev.target.value;
      const form = "keyword=" + encodeURIComponent(keyword);
      fetch('/api/search', {
          method: "POST",
          headers: {
            "Accept": "application/json, application/xml, text/plain, text/html, *.*",
            "Content-Type": 'application/x-www-form-urlencoded; charset=utf-8'
          },
          body: form
        })
        .then(res => {
          if (res.status >= 200 && res.status < 300) {
            return res.json();
          } else {
            res.text().then((body) => {
              throw new Error(`${res.statusText}: ${body}`);
            }).catch(ex => {
              const keywordSpan = document.getElementById("keywordSpan");
              keywordSpan.innerText = `ไม่สามารถค้นข้อมูลได้เนื่องจากปัญหาด้านล่าง`;
              showError(ex);
            });
          }
        })
        .then(json => {
          if (json) {
            const keywordSpan = document.getElementById("keywordSpan");
            keywordSpan.innerText = `ค้นคำว่า ${keyword} เจอทั้งหมด ${json.length} เรื่อง`;
            showResultTable(json);
          }
        })
        .catch(ex => {
          const keywordSpan = document.getElementById("keywordSpan");
          keywordSpan.innerText = `ไม่สามารถค้นข้อมูลได้เนื่องจากปัญหาด้านล่าง`;
          showError(ex);
        })

    }
  });
});


function showResultTable(json) {
  const resultPanel = document.getElementById('resultPanel');
  const tableHeader = `<tr>
    <th>No.</th>
    <th>EP</th>
    <th>ช่วง</th>
    <th>คนเล่า</th>
    <th>รายละเอียด</th>
    <th class="center">ฟัง (ผู้ใช้มือถือก็ใช้เลื่อนเวลาเอานะ)</th>
  </tr>`;

  const tableRows = json.map(generateRow);
  const generatedString = `<table>
    <thead>${tableHeader}</thead>
    <tbody>${tableRows.join("")}</tbody>
    </table>`;
  resultPanel.innerHTML = generatedString;
}

function generateRow(story, idx) {
  const descriptionClassnames = generateDescriptionClassname(story);
  return `<tr>
      <td>${idx + 1}</td>
      <td>${story.name}</td>
      <td>${story.part}</td>
      <td>${story.narrator}</td>
      <td class="${descriptionClassnames}">${story.description}</td>
      <td class="center">
        <a href="https://soundcloud.com/gettalks/youtoop-${story.ep}#t=${story.epTime}" target="_blank">
          <img id="image" src="/assets/${soundcloudLogo}" width="32" height="32" alt="ฟังบน Soundcloud">
        </a>
        <div id="time-${idx}">${story.epTime}</div>
      </td>
    </tr>`;
}

function generateDescriptionClassname(story) {
  return classnames({
    recommended: story.description.includes('เรื่องนี้ดี') ||
      story.description.includes('เรื่องนี้พีค') ||
      story.description.includes('เรื่องนี้พีก')
  });
}

function showError(ex) {
  const resultPanel = document.getElementById('resultPanel');
  const errorBox = `<div class="red lighten-4">
    ${ex}
  </div>`;
  resultPanel.innerHTML = errorBox;
}