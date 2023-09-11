# fonepayQrScrapper

### Run the node server
```js
npm start
```

### Request
- send <b>POST</b> request to /scrapQr with following request body
  #### Request Body
  ```js
  {
    redirect_url : 'Valid Fonepay web payment redirect url'
  }
  ```
### Response
```js
{
  status: 200,
  msg: 'Qr base64 image data',
  data: {
    qr: 'Base64 encoded image data'
  }
}
```
