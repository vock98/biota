//  input[type=text] empty value
function input_empty(){
	$("input[type=text]").val("");
};

// api_type selected 
$("#api_type").change(function(){
	input_empty();
	var $idx = this.selectedIndex;
	$("#api_item").find(".api_item").addClass("hidden").eq($idx).removeClass("hidden");
});

// api_add_item
$("#api_add_item").click(function(){
	var $type_idx   = $("#api_type").prop("selectedIndex"),
		$clone_item = $("#api_clone_item").find(".api_item").eq($type_idx).children().clone();
	$("#api_item").find(".api_item").eq($type_idx).append($clone_item);
});

// api_remove_item
$(document).on("click",".api_item_remove",function(){
	$(this).parent().parent(".row").remove();
});

// btn-cancel
$("#btn-cancel").click(input_empty);