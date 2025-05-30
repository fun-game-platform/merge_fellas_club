// ... existing code ...
"use Client";
import Script from "next/script";
function MonetagAd() {
  return (
    <>
      <Script
        id="monetag-ad"
        data-cfasync="false"
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `(function(d,z,s){s.src='https://'+d+'/400/'+z;try{(document.body||document.documentElement).appendChild(s)}catch(e){}})('vemtoutcheeg.com',9334434,document.createElement('script'))`,
        }}
      />
    </>
  );
}
// ... existing code ...
export default MonetagAd;
