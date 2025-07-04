#1. Links  
[PROC HTTP blog posts](https://blogs.sas.com/content/tag/proc-http/)  
  
[blog post: How to test PROC HTTP and the JSON library engine](https://blogs.sas.com/content/sasdummy/2018/01/23/check-json-and-http/)  
[blog post: How to translate your cURL command into SAS code](https://blogs.sas.com/content/sgf/2020/07/30/curl-to-proc-http/)  
[blog post: From cURL to PROC HTTP on SAS Viya](https://communities.sas.com/t5/SAS-Communities-Library/From-cURL-to-PROC-HTTP-on-SAS-Viya/ta-p/964762)  
[blog post: Using PROC HTTP 1 - Review of the HTTP Protocol](https://communities.sas.com/t5/SAS-Communities-Library/Using-PROC-HTTP-1-Review-of-the-HTTP-Protocol/ta-p/960340)  
[blog post: Using PROC HTTP 2 - Accessing Internet Information and Debugging](https://communities.sas.com/t5/SAS-Communities-Library/Using-PROC-HTTP-2-Accessing-Internet-Information-and-Debugging/ta-p/964119)  
  
[paper: The ABCs of PROC HTTP](https://www.sas.com/content/dam/SAS/support/en/sas-global-forum-proceedings/2019/3232-2019.pdf)  
[paper: REST Just Got Easy with SAS® and PROC HTTP](https://www.sas.com/content/dam/SAS/support/en/sas-global-forum-proceedings/2020/4426-2020.pdf)  


#2. Syntax between PROC HTTP and cURL  
|PROC HTTP syntax|cURL syntax|
|-------- |-----|
|PROC HTTP URL="target-URI"|     |
|PROC HTTP METHOD ="\<http-method\>"|-X, --request \<method\>|
|PROC HTTP \<authentication-type-options\>|     |
|PROC HTTP \<header-options\>|-H, --header \<header/@file\>|
|PROC HTTP \<web-server-authentication-options\>|     |
|PROC HTTP \<proxy-server-connection-options\>|     |
|PROC HTTP \<IN=fileref \| FORM(arguments) \| MULTI \<options\> \| "string"\>| -d, --data <data> |
|PROC HTTP \<OUT=fileref-to-response-data\>| -o, --output \<file\>    |
|PROC HTTP \<OAUTH_BEARER="token"\>| -H "Authorization: Bearer token"|
|PROC HTTP \<proxyhost="proxy-host-name"<br>proxyport=proxy-port-number<br>proxyusername="proxy-user-name"<br>proxypassword="proxy-passwd"\>| -x http://proxy.example.com:8080<br>-U proxy-user-name:proxy-passwd    |
|\<HEADERS "HeaderName"="HeaderValue" \<"HeaderName-n"="HeaderValue-n"\>;\>|-H, --header \<header/@file\>|
|HEADERS "Authorization"="Bearer token"| -H "Authorization: Bearer token"|
|\<DEBUG options;\><br>NOTE: Always use OUTPUT_TEXT when LEVEL=3 is specified.|     |


