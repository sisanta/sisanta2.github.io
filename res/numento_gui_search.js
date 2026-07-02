
class NumentoGuiFtSearch
{
    constructor() 
    {
      this.m_input_selector = null;
      this.m_engine = null;
      this.m_old_value = "";
      this.m_search_timer = null;
    }

    setInputSearchSelector(sel)
    {
      this.m_input_selector = sel;
    }

    checkInputChange (p_this)
    {

      let words = IntuisphereFtSearch.splitQuery(p_this.m_input.value);
      let words_string = words.join(' ');


      if (p_this.m_old_value!=words_string)
      {
        p_this.m_old_value = words_string;
        p_this.onChangeInput();
      }
    }

    onChangeInput ()
    {
      if (this.m_search_timer !=null)
      {
        clearTimeout(this.m_search_timer);
        this.m_search_timer = null;
      }
      this.m_search_timer =setTimeout(this.onDelayedSearch,300,this);
      //console.log('checkInputChange  = '+this.m_input.value);
    }

    onDelayedSearch(p_this)
    {
       p_this.search();
    }


    init()
    {
      var p_this = this;
      this.m_input = document.querySelector(this.m_input_selector);

      setInterval(this.checkInputChange, 300,this);
    }

    setMessageGui(b,html)
    {
      var message_item = document.querySelector(".message_item");
      if (b==true)
      {
        message_item.style.display = 'block';
        message_item.innerHTML = html;
        
      }
      else
      {
        message_item.style.display = 'none';
      }
    }
    
    setEngine(engine)
    {
      var p_this = this;
      this.m_engine = engine;
      this.m_engine.callback= function(res)
      {
          //
          if (res.success)
          {
      
              var url = window.location.href;
              const regex = /page=[0-9]*/gi;
              url = url.replace(regex,"page=0");
              history.replaceState({}, "", url)


              var context_search = res.context_search;

              var query = context_search.m_query;

              p_this.m_old_value = query;


              p_this.m_old_value = IntuisphereFtSearch.splitQuery(query).join(' ');;


              p_this.m_input.value = query;
              var nb_results = 0;
              if (p_this.m_input.value.length==0)
              {
                nb_results =p_this.loadCurrentpage()
              }
              else
              {
                nb_results =p_this.loadCurrentpage(res.search_results,context_search);
              }   
          }
          p_this.setMessageGui(false);

          if (nb_results==0)
          {
            p_this.setMessageGui(true,trMessages.TR_NO_RESULT_FOUND);
          }

      }
    }

    loadCurrentpage(search_results,context_search)
    {
      if (search_results!=undefined)
      {
        nmtMobile.setSearchResults(search_results,context_search);
      }
      else
      {
        nmtMobile.setSearchResults(null);
      }
      nmtMobile.loadCurrentListingPage();
      
    }

    search()
    {
      var input = document.querySelector(this.m_input_selector);
      var query = input.value;

      let words = IntuisphereFtSearch.splitQuery(query);
      if (words.length==0)
      {
        this.setMessageGui(false);
        this.loadCurrentpage();
        return;
      }


      var context_search = {
        'm_query':query,
        'm_page':0,
        'm_current_keyid':''
      };


      this.setMessageGui(true,"<div class='lds-ring'><div></div><div></div><div></div><div></div></div> <br>"+trMessages.TR_SEARCH_LABEL);
      this.m_engine.search(context_search);
  
    }
}


