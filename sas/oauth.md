#1. Google Drive access  
[Paper SAS224-2017: Show Off Your OAuth](https://support.sas.com/resources/papers/proceedings17/SAS0224-2017.pdf)  
[blog post: Using SAS to access Google Analytics APIs](https://blogs.sas.com/content/sasdummy/2017/04/14/using-sas-to-access-google-analytics-apis/)  

```sas
* Request access token;
proc http url="https://oauth2.googleapis.com/token"
    method="POST"
    out=resp
    headerout=hdrs
    ct="application/x-www-form-urlencoded"
    in=form(
            "code"="&code" 
            "client_id"="&client_id" 
            "client_secret"="&client_secret" 
            "redirect_uri"="&redirect_uri" 
            "grant_type"="authorization_code");
run;

* Check if the access token if valid;
proc http url="https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=&access_token" out=resp; run;

* Download Google sheet as XLSX
proc http 
    url="https://docs.google.com/spreadsheets/d/1roVDi0WBqZ4t-gguUJ5eNKWSxJBP4AWiAc3e9sOgdtU/export?format=xlsx" 
    out=resp;
    headers "Authorization" = "Bearer &access_token.";
run;
```

#2. App Password for GMail  
```sas

```
