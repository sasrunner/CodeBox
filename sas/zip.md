#1 zip a directory of sas files  
Source: https://communities.sas.com/t5/SAS-Programming/How-to-Download-a-directory-of-sas-files-SAS-Studio-amp-SAS-on/td-p/761710

```sas
filename indir "<dir>";
filename out zip "<path of zip file>";

data _null_;
    length fname mname $256 ;
    did=dopen('indir');
    putlog did=;
    
    do i=1 to dnum(did);
        mname=dread(did, i);
        
        if scan(mname, -1, '.') = 'sas' then do;
            n+1;
            fname=catx('/',pathname('indir'),mname);
            infile dummy filevar=fname end=eof;
            file out memvar=mname;
            
            do while (not eof);
                input ;
                put _infile_;
            end;
        end;
    end;
    did=dclose(did);
    
    stop; /* added to fix the bug */
run;
```

#2. ods package zip method  
Source: https://stackoverflow.com/questions/41872561/sas-zipping-folder
```sas
%let n=0;
%macro readCatalog(path, localpath);
    %local rc _path filrf did noe filename fid i;

    %if &localpath = %then
        %let _path=&path;
    %else 
        %let _path=&path\&localpath;

    %let n=%eval(&n+1);
    %let filrf=DIR&n;

    %let rc = %sysfunc(filename(filrf, &_path));
    %let did = %sysfunc(dopen(&filrf));
    %let noe = %sysfunc(dnum(&did));

    %do i = 1 %to &noe;
        %let filename = %bquote(%sysfunc(dread(&did, &i)));
        %let fid = %sysfunc(mopen(&did, &filename));
        %if &fid > 0 %then %do;
            %put &=path &=localpath &=_path &=filename;
            ods package(newzip) add file="&_path\&filename" path="&localpath";
        %end;
        %else %do;
            %if &localpath = %then
                %readCatalog(&path, &filename);
            %else 
                %readCatalog(&path, &localpath\&filename);
        %end;
    %end;
    %let rc=%sysfunc(dclose(&did));
%mend readCatalog;

%macro createZIP(path, archive_name, archive_path);
    %put *** Creating an archive (&archive_path\&archive_name) ***;
    ods package(newzip) open nopf;
    %readCatalog(&path)
    ods package(newzip) publish archive properties(
        archive_name="&archive_name" 
        archive_path="&archive_path"
    );
    ods package(newzip) close;
%mend createZIP;

%createZIP(C:\temp, test.zip, C:\temp2)
```

#3. fcopy zip method
Source: https://communities.sas.com/t5/SAS-Programming/SAS-code-to-zip-entire-directories-and-keep-directory-structure/td-p/713036
```sas
filename dirtree url "https://raw.githubusercontent.com/sasutils/macros/master/dirtree.sas";
%include dirtree;

%let inpath=c:\project\template ;
%let outfile=c:\project\template.zip ;

%dirtree(&inpath)

data _null_;
    if eof then put 'NOTE: copied ' ncopied 'files from ' "'&inpath'" ' to ' "'&outfile'.";
    set dirtree end=eof;
    where type ne 'D' ;
    length in out $8 target msg $256;
    target=translate(catx('/',substrn(path,length("&inpath")+2),filename),'/','\');
    rc1=filename(in,catx('/',path,filename),'disk','recfm=f lrecl=512');
    rc2=filename(out,"&outfile",'zip',catx(' ','recfm=f lrecl=512',cats('member=',quote(trim(target),"'")))) ;
    rc3=fcopy(in,out);
    if rc3 then do;
        msg=sysmsg();
        put (_n_ rc: target msg) (=);
    end;
    else ncopied+1;
run;
```
