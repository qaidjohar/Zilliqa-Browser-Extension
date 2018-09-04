function calcbmifunc()
{
    //var form = document.forms['calcbmi']
    //var height = form.ht.value;
    //var weight = form.wt.value;
    //alert(form.ht.value + "man" +form.wt.value);
    ////var height = Float.parseFloat("ht");
    //var weight = Float.parseFloat("wt");
    var height = document.getElementById('hti').value;
                    var weight = document.getElementById('wti').value;
                    //location.replace("#underweight")
                    //alert("Yoyo man");
                    var result;
    var result;
    var ht2;
    ht2 = (height/100);
    result = weight/(ht2*ht2);
    
   /* if(parseFloat(height) == NaN && parseFloat(weight) == NaN)
    {
        alert("Please Enter Correct Values");
        form.ht.focus();
    }*/
    if(isNaN(result))
    {
		alert("Please Enter Correct Values");
		 //location.replace("#bmi");
		 location.replace("#bmi");
		
	}
    else
    {
                //result.toFixed(2);
		if(result <=18.5){
			punder.innerHTML = "BMI :: "+result.toFixed(2);
                        //document.body.style.backgroundColor="#FFDBA9"; +
                        punder2.innerHTML = "Ohh...You are Underweight.";
                        //document.getElementById("underweight").style.backgroundColor="#FFDBA9";
			location.replace("#underweight");
                         
		}
                else if(result >18.5 && result <=25)
                {
                        pnormal.innerHTML = "BMI :: "+result.toFixed(2);
                        //document.body.style.backgroundColor="#FFDBA9"; +
                        pnormal2.innerHTML = "Yeah.!! Weight is Normal.";
                        
                        //document.getElementById("normalweight").style.backgroundColor="#FFDBA9";
			location.replace("#normalweight");
                }
                else if(result>25 && result <=30)
                {
                        pover.innerHTML = "BMI :: "+result.toFixed(2);
                        //document.body.style.backgroundColor="#FFDBA9"; +
                        pover2.innerHTML = "hey..You are Overweight";
                        
                        //document.getElementById("overweight").style.backgroundColor="#FFDBA9";
			location.replace("#overweight");
                }
		else
		{
			pobe.innerHTML = "BMI :: "+result.toFixed(2);
                        //document.body.style.backgroundColor="#FFDBA9"; +
                        pobe2.innerHTML = "Oh no..You are in Obesity.";
                        
                        //document.getElementById("obesity").style.backgroundColor="#FFDBA9";
			location.replace("#obesity");
                        
		}
    }
    
}
                
