function nmtChangePage(i)
{

  nmtMobile.changePage(i);

}



class NumentoMobileManager
{
  constructor()
  {
    this.m_listing_params = null;
    this.m_current_page = 0;
    this.m_listing_current_search_results = null;
    this.m_current_query = "";
    this.m_initial_keyid = "";

  }

  setSearchResults(results,context_search)
  {
    this.m_listing_current_search_results = results;
    this.m_current_page = 0;
    this.m_current_query = "";
    this.m_initial_keyid = "";

    if ((context_search!=undefined)&&(context_search!=null))
    {
      this.m_current_page = context_search.m_page;
      this.m_current_query = context_search.m_query;

      this.m_initial_keyid = context_search.m_current_keyid;
    }
    
  }

  setListingParameters(params)
  {
    this.m_listing_params =params;
  }

  initListing()
  {
      var elem = document.querySelector('.item');

      var elem_tmp = elem.cloneNode(true);

      var content = document.querySelector('.content');
      content.innerHTML="";

      let nb_items_per_page = this.m_listing_params.nb_items_per_page;

      for (var i=0;i<nb_items_per_page;i++)
      {
          var clone = elem_tmp.cloneNode(true);
          clone.classList.add("list_item_"+i);
          content.appendChild(clone);
      }
      this.internal_AcquireCurrentPage();


      let urlParams = new URLSearchParams(window.location.search);


      var keyid = urlParams.get('keyid');
      keyid = (keyid==null)?"":keyid;

      this.m_initial_keyid = keyid;

      var query = urlParams.get('query');
      if ((query!=null)&&(query.length>0))
      {


        this.m_current_query = query;

        var context_search = {
          'm_query':this.m_current_query,
          'm_page':this.m_current_page,
          'm_current_keyid':keyid
        };

        engine_search.search(context_search);
      }
      else
      {
          this.loadCurrentListingPage();
      }
      
    //}
  }

  changePage(n_page)
  {
    this.m_current_page = n_page;
    this.loadCurrentListingPage();
  }

  internal_AcquireCurrentPage()
  {
      let urlParams = new URLSearchParams(window.location.search);
      var n_page = parseInt(urlParams.get('page'));
      if (isNaN(n_page))n_page = 0;
      if (n_page==undefined)n_page = 0;
      this.m_current_page = n_page;
  }
  internal_builPagePanel(pages_node,fullIds)
  {
      pages_node.innerHTML = "<a class='page_btn'>0</a>";// A REVOIR
      var n_page = this.m_current_page;
      let range_page = this.m_listing_params.range_page;
      let nb_items_per_page = this.m_listing_params.nb_items_per_page;

      var btn_node_tmp = pages_node.querySelector('.page_btn').cloneNode(true);
      pages_node.innerHTML="";

      let nb_pages = Math.ceil(fullIds.length/nb_items_per_page);
      let max_index_global = nb_pages-1;
    
      var min_index_page = Math.max(0,n_page-(range_page));
      var max_index_page = Math.min(max_index_global,min_index_page+2*range_page);

      var dec = ((n_page+range_page)-max_index_global)

      if (dec>0)
      {
        min_index_page = Math.max(0,min_index_page-dec);
      }

      if (nb_pages>1)
      {
          if (min_index_page>0)
          {
                var btn_node = btn_node_tmp.cloneNode(true);
                btn_node.setAttribute("href","javascript:nmtChangePage("+(min_index_page-1)+")");
                btn_node.innerHTML="...";
                pages_node.appendChild(btn_node);
          }

            for (var i=min_index_page;i<=max_index_page;i++)
            {
                var btn_node = btn_node_tmp.cloneNode(true);
                if (i==n_page)
                {
                  btn_node.classList.add("page_btn-highlight");
                  btn_node.setAttribute("href","javascript:void(0)");
                }
                else
                {
                  btn_node.setAttribute("href","javascript:nmtChangePage("+i+")");
                }
                btn_node.innerHTML=""+(i+1);
                pages_node.appendChild(btn_node);
            }

          ///
          if (max_index_page<max_index_global)
          {
                var btn_node = btn_node_tmp.cloneNode(true);
                btn_node.setAttribute("href","javascript:nmtChangePage("+(max_index_page+1)+")");
                btn_node.innerHTML="...";
                pages_node.appendChild(btn_node);
          }
      }
  }
  internal_builPagePanels(fullIds)
  {
      var p_this = this;
      let pages_nodes = document.querySelectorAll(".pages");
      pages_nodes.forEach(function(pages_node) 
      {
          p_this.internal_builPagePanel(pages_node,fullIds)
      });
  }

  highlightFor(element,color,msec){
      var origcolor = element.style.backgroundColor
      element.style.backgroundColor = color;
      var t = setTimeout(function(){
         element.style.backgroundColor = origcolor;
      },(msec));
  }

  scrollToDiv(to) 
  {
    var element = document.body;

    var difference = to.offsetTop - element.scrollTop;
    element.scrollTop = element.scrollTop + difference;
    scrollTo(element, to.offsetTop-10, 0);
/*
    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
    */
  }
  loadCurrentListingPage(force_array_results)
  {
      var p_this = this;
      var n_page = this.m_current_page;

      let fullIds = this.m_listing_params.list_ids;

      if (this.m_listing_current_search_results!=null)
      {
        fullIds = this.m_listing_current_search_results;
      }

      let nb_items_per_page = this.m_listing_params.nb_items_per_page;
      let hash_database = this.m_listing_params.hash_database;
      let card_url_pattern = this.m_listing_params.card_url_pattern;


      this.internal_builPagePanels(fullIds);

      var item_node_hightlighted = null;
      for (var i=0;i<nb_items_per_page;i++)
      {
          let item_node = document.querySelector('.list_item_'+i);
          let n_item = (n_page*nb_items_per_page)+i;

          let img_node = item_node.querySelector('.thumbnail img');
          let label_node = item_node.querySelector('.item_label');
          let label_sub_node = item_node.querySelector('.item_sub_label');


          if (n_item<fullIds.length)
          {
              let key_id = fullIds[n_item];
              

              item_node.classList.add('is-visible');
        
              item_node.setAttribute("href",card_url_pattern + key_id+"&page="+n_page+"&query="+encodeURI(this.m_current_query));
              item_node.style.backgroundColor="";
              if (this.m_initial_keyid==key_id)
              {
                item_node_hightlighted = item_node;
                this.m_initial_keyid = "";
                item_node.style.backgroundColor="rgba(255,255,0,0.2)";
              }
              var url = p_this.m_listing_params.card_json_pattern+"?t="+hash_database;;
              url = url.replace("{{key_id}}",key_id);

              fetch(url)
              .then(function(response) { return response.json(); })
              .then(function(json_datas) {

                var img_url = p_this.m_listing_params.pattern_url_thumbnail;


                var img = json_datas.thumbnail_mini;
                if (img.length==0)
                {
                  img_url = "res/img/img_default_listing.svg";
                }

                img_url = img_url.replace("{{key_id}}",key_id);
                img_url = img_url+"?t="+hash_database;
                img_node.setAttribute("src",img_url);
                
                if (img.length==0)
                {
                  img_node.style.opacity = 0.4;
                }
                else
                {
                  img_node.style.opacity = 1.0;
                }

                label_node.innerHTML = json_datas.main_title;
                label_sub_node.innerHTML = json_datas.sub_title;

              });
          }
          else
          {
            item_node.classList.remove('is-visible');
            img_node.setAttribute("src","");
            label_node.innerHTML = "";
          }
      }
      if (item_node_hightlighted!=null)
      {
    //    this.highlightFor(item_node_hightlighted,"rgba(255,255,0,0.2)",800);
        this.scrollToDiv(item_node_hightlighted);
      }
  }


  loadCurrentCard(params)
  {
     this.internal_AcquireCurrentPage();
    let pattern_card_json = params.pattern_card_json;
    let pattern_url_thumbnail = params.pattern_url_thumbnail;
    let hash_database = params.hash_database;


    var n_page = this.m_current_page;




    
      var urlParams = new URLSearchParams(window.location.search);
      let key_id = urlParams.get('id');
      this.m_current_query= urlParams.get('query');


      //lien retour



      var img_url = pattern_url_thumbnail;
      img_url = img_url.replace("{{key_id}}",key_id);


      var url = pattern_card_json+"?t="+hash_database;;
      url = url.replace("{{key_id}}",key_id);


      var img_main_node = document.querySelector('.section_main_image');

      var img_node = document.querySelector('.main_image_source');

      var elem_field = document.querySelector('.field_item');

      var elem_field_tmp = elem_field.cloneNode(true);
     var content = document.querySelector('.content_fields');
     content.innerHTML="";

     var title_node = document.querySelector('.lnk_back_to_listing');

      var href_back_to_listing = title_node.getAttribute("href");

      href_back_to_listing = href_back_to_listing + "?page="+n_page+"&query="+encodeURI(this.m_current_query)+"&keyid="+key_id;


     title_node.setAttribute("href",href_back_to_listing);


      fetch(url)
      .then(function(response) { return response.json(); })
      .then(function(json_datas) {

          var arr_fields = json_datas.fields;

          var src_img = json_datas.thumbnail_big;
          if (src_img.length!=0)
          {
           img_url = img_url+"?t="+hash_database;
           img_main_node.style.display = 'flex';
          }
          else
          {
            img_url = "";
            img_main_node.style.display = 'none';
          }
          img_node.setAttribute("src",img_url);

          for (var i=0;i<arr_fields.length;i++)
          {
            var field = arr_fields[i];
            var clone_field = elem_field_tmp.cloneNode(true);

            var node_f_name = clone_field.querySelector('.f_name');
            var node_f_value = clone_field.querySelector('.f_value');

            node_f_name.innerHTML = field.name;
            node_f_value.innerHTML = field.value;
                    
            content.appendChild(clone_field);
          }
          
      });
  }

}


