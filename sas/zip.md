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

#4. Add new member into existing zip file  
Source: https://blogs.sas.com/content/sasdummy/2016/03/04/add-files-to-a-zip-archive-with-filename-zip/

```sas
%macro assignFilerefToDataset(_dataset_name);
    %local outDsName;
    ods output EngineHost=File;
    proc contents data=&_dataset_name.;
    run;
    proc sql noprint;
        select cValue1 into: outDsName 
            from work.file where Label1="Filename";
    quit;
    filename data_fn "&outDsName.";
%mend;

%assignFilerefToDataset(sashelp.class);

/* Use FILENAME ZIP to add a new member -- CLASS */
/* Put it in the data subfolder */
filename addfile zip "&projectDir./project.zip" 
    member='data/class.sas7bdat';
    
/* byte-by-byte copy */
/* "copies" the new file into the ZIP archive */
data _null_;
    infile data_fn recfm=n;
    file addfile recfm=n;
    input byte $char1. @;
    put  byte $char1. @;
run;
 
filename addfile clear;
    
/* Use FILENAME ZIP to add a new member -- CARS */
%assignFilerefToDataset(sashelp.cars);

/* Put it in the data subfolder */
filename addfile zip "&projectDir./project.zip" member='data/cars.sas7bdat';
/* byte-by-byte copy */
/* "copies" the new file into the ZIP archive */
data _null_;
    infile data_fn recfm=n;
    file addfile recfm=n;
    input byte $char1. @;
    put  byte $char1. @;
run;
 
filename addfile clear;
```

#5. Report contents of zip file  
Source: https://blogs.sas.com/content/sasdummy/2016/03/04/add-files-to-a-zip-archive-with-filename-zip/
```sas
/* Report on the contents of the ZIP file */
/* Assign a fileref wth the ZIP method */
filename inzip zip "&projectDir./project.zip";
/* Read the "members" (files) from the ZIP file */
data contents(keep=memname);
    length memname $200;
    fid=dopen("inzip");
    if fid=0 then
        stop;
    memcount=dnum(fid);
    do i=1 to memcount;
        memname=dread(fid,i);
        output;
    end;
    rc=dclose(fid);
run;
/* create a report of the ZIP contents */
title "Files in the ZIP file";
proc print data=contents noobs N;
run;
```
