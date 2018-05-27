# Youtoop Guide

ตัวช่วยค้นหาเรื่องงมงายในรายการยูธูป โดยใช้[ข้อมูลที่รวบรวมโดยคุณเส็ง](https://docs.google.com/spreadsheets/d/1zNylfIA5Jy9p3HYJ38QHC2FfvJ7bn3Bb8NRf3dJhmIc/edit?usp=sharing)

## วิธีการค้นหาเรื่อง

1. จิ้มที่นี่
2. พิมพ์ข้อความที่จะค้นหาในช่องค้นหา
3. กด Enter แล้วรอแป๊บนึง


## วิธีการดาวน์โหลดข้อมูลใน Google Sheets

1. ออก API Key สำหรับ Sheets API จาก [Google Developer Console](https://console.developers.google.com/apis/credentials)
2. สร้างไดเรคทอรี ./dist/data สำหรับเก็บข้อมูลของ Sheet ด้วยคำสั่ง
```bash
mkdir -p ./dist/data
```
3. ใช้คำสั่ง `npm run fetch:data` สำหรับดึงข้อมูลของเรื่องและ `npm run fetch:filter` สำหรับดึงข้อมูลคำสำคัญดังนี้
```bash
npm run fetch:data -- {sheetId} {key}
```
และ
```bash
npm run fetch:data -- {sheetId} {key}
```
โดยที่ `{sheetId}` คือไอดีของ Sheet และ `{key}` คือ API Key ที่ได้จากข้อ 1.


## พบปัญหา

กรุณาแจ้งไว้ใน [Issue](https://github.com/wiennat/youtoop-guide/issues)

## ขอบคุณ

ขอบคุณพี่แอนพี่แซมและทุกๆ ท่านที่ช่วยกันส่งเรื่องมาร่วมสนุกในยูธูป
ขอบคุณคุณเส็งที่อนุญาตให้ใช้ข้อมูล
