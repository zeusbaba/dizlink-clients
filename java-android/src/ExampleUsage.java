/***
 *   Copyleft 2014 - WareNinja.com / Rumble In The Jungle!
 * 
 *  @author: yg@wareninja.com
 *  @see https://github.com/WareNinja
 *  disclaimer: I code for fun, dunno what I'm coding about :-)
 */


import java.util.HashMap;
import java.util.Map;

import com.google.gson.JsonObject;
import com.wareninja.opensource.dizlink.DizLinkApiClient;
import com.wareninja.opensource.dizlink.utils.ResponseListener;
import com.wareninja.opensource.dizlink.utils.ResponseMeta;
import com.wareninja.opensource.dizlink.utils.ResponseModel;

/*
 * simple class to... 
 * make calls for quick validation of each implemented function! 
 */
public class ExampleUsage {

	final static String TAG = ExampleUsage.class.getSimpleName();
	
	/**
	 * @param args
	 * api_url apptoken
	 */
	public static void main(String[] args) {
		
		if (args.length<3) {
			System.out.println(TAG+" " + "missing parameters... Read the source Luke! ");
			System.out.println(TAG+" required parameters: " + "api_url apptoken");
			return;
		}
		
		final DizLinkApiClient mDizLinkApiClient = new DizLinkApiClient(
				args[0] // api_url  : e.g. http://your_domain.com
				, args[1] // apptoken : you get from discourse admin
				);
		
		// TEST DATA to inject with API calls!
		String test_long_link = "http://diz.link/developers";
		String test_simple_links = "devapi,dizdev";
		String test_dizlink_id = "devapi";
		
		Map<String, String> parameters = null;
		String apiAction = "";
		JsonObject jsonObject = null;
		
		ResponseModel responseModel;
		
		// --- makeLink :: Shorten a long URL! ---
		apiAction = "makeLink";
		parameters = new HashMap<String, String>();
		parameters.put("long_link", test_long_link);
		parameters.put("simple_links", test_simple_links);
		responseModel = mDizLinkApiClient.makeLink(parameters);
		System.out.println(apiAction + " responseModel -> " + responseModel.toJsonStringPrinting());
		
		
		// --- getLinkMeta :: Expand a short URL ---
		apiAction = "getLinkMeta";
		parameters = new HashMap<String, String>();
		parameters.put("dizlink_id", test_dizlink_id);
		responseModel = mDizLinkApiClient.getLinkMeta(parameters);
		System.out.println(apiAction + " responseModel -> " + responseModel.toJsonStringPrinting());
		
		
		// --- getLinkStats :: Analytics/stats of a short URL ---
		apiAction = "getLinkStats";
		parameters = new HashMap<String, String>();
		parameters.put("dizlink_id", test_dizlink_id);
		responseModel = mDizLinkApiClient.getLinkStats(parameters);
		System.out.println(apiAction + " responseModel -> " + responseModel.toJsonStringPrinting());
		
		
		// --- getMyLinks :: MyLinks ---
		apiAction = "getMyLinks";
		parameters = new HashMap<String, String>();
		responseModel = mDizLinkApiClient.getMyLinks(parameters);
		System.out.println(apiAction + " responseModel -> " + responseModel.toJsonStringPrinting());
		
		
		/*// ASYNC call example! 
		apiAction = "makeLink";
		parameters = new HashMap<String, String>();
		parameters.put("long_link", test_long_link);
		parameters.put("simple_links", test_simple_links);
		mDizLinkApiClient.makeLink(parameters, new ResponseListener(){

			@Override
			public void onBegin(String info) {
				System.out.println("info: "+info);
			}
			@Override
			public void onComplete_wModel(ResponseModel responseModel) {
				// successful result
				System.out.println("SUCCESS! -> " + responseModel.toJsonStringPrinting());
			}

			@Override
			public void onError_wMeta(ResponseMeta responseMeta) {
				// error
				System.out.println("ERROR! -> " + responseMeta.toJsonStringPrinting());
			}
		});
		
		*/
		
		
		
	}

}
