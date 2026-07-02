
<?php
        $arr_params = [];
        parse_str($_SERVER['QUERY_STRING'],$arr_params);
        $mime = "";
        $file= "";

        if (array_key_exists('mime', $arr_params))
        {
          $mime = $arr_params['mime'];
        }
        if (array_key_exists('file', $arr_params))
        {
           $file= $arr_params['file'];
        }   
            
        if (strlen($file)==0)exit;


        $src_file_to_return = __DIR__.'/'.$file;


        header('Pragma: public');
        header('Cache-Control: max-age=86400');
        header('Expires: '. gmdate('D, d M Y H:i:s \G\M\T', time() + 86400));
        if (strlen($mime)>0)
        {
             header('Content-Type: '.$mime);
        }
       
        @readfile($src_file_to_return);

    exit;
