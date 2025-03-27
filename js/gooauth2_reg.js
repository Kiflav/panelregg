	var client;
    var access_token;

	function initClient() {
        
          var clientid = document.getElementById('ggclid').value;
          
          client = google.accounts.oauth2.initTokenClient({
          client_id: clientid,
          scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
          callback: (tokenResponse) => {
            access_token = tokenResponse.access_token;
            //console.log("init access " + access_token);
            $('regisgoogletoken').value = access_token; 
            $('googleregistrate').submit();
          },
        });
     }
     
     function getTokenRegist() {
        client.requestAccessToken();
     }
     
     function revokeToken() {
        google.accounts.oauth2.revoke(access_token, () => {console.log('access token revoked')});
     }  