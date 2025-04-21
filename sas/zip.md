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
    
    stop;
run;
```
