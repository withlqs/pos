var outputText = "";
var itemCount = {}, promotedItems = {}, standardItems = {};
var totalMoney = 0, saveMoney = 0;
var listSeperator = "----------------------\n",
    endMark = "**********************",
    marketName = "没钱赚商店",
    promotionSentence = "挥泪赠送商品：\n",
    billHeader = "***<"+marketName+">购物清单***\n",
    moneyUnit = "元";

function printInventory(inputs) {
	convertToStandardSources(inputs);
	outputText += billHeader;
	scanItems(inputs);
	printMainBill();
	outputText += listSeperator;
	printPromotion();
	outputText += listSeperator;
	printTotalCount();
	outputText += endMark;

	console.log(outputText);
}

function convertToStandardSources(inputs) {
	var allItems = loadAllItems();

	_.each(allItems, function(itemSample) {
		standardItems[itemSample.barcode] = {
			name: itemSample.name,
			unit: itemSample.unit,
			price: itemSample.price
		};
	});
}

function scanItems(inputs) {
	var itemNumberInString = "", itemBarcode = "", itemNumber;

	_.each(inputs, function(itemSample) {
		itemBarcode = itemSample.split('-')[0];
		itemNumberInString = itemSample.split('-')[1];
		itemNumber = 1;
		if (itemNumberInString != null) {
			itemNumber = parseInt(itemNumberInString);
		}
		if (itemCount[itemBarcode] == null) {
			itemCount[itemBarcode] = 0;
		}
		itemCount[itemBarcode] += itemNumber;
	});
}

function printMainBill() {
	var itemMoney;

	_.each(itemCount, function(itemSample, itemBarcode) {
		itemMoney = getSumMoney(itemBarcode);
		totalMoney += itemMoney;
		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" + itemSample + 
			standardItems[itemBarcode].unit + "，单价：" + standardItems[itemBarcode].price.toFixed(2) + 
			"(" + moneyUnit + ")，小计：" + itemMoney.toFixed(2) + "(" + moneyUnit + ")\n";
	});
}

function getSumMoney(itemBarcode) {
	var allPromotions = loadPromotions();
	var sumMoney = itemCount[itemBarcode]*(standardItems[itemBarcode].price);

	_.each(allPromotions, function(promotionSample) {
		switch (promotionSample.type) {
			case "BUY_TWO_GET_ONE_FREE": {
				sumMoney = BUY_TWO_GET_ONE_FREE(promotionSample.barcodes, itemBarcode);
			}
		}
	});
	return sumMoney;
}

function BUY_TWO_GET_ONE_FREE(barcodeOfPromotions, itemBarcode) { // one promotion, one function
	var nowItemCount = itemCount[itemBarcode];
	var nowItemPrice = (standardItems[itemBarcode]).price;
	var sumMoney = nowItemCount*nowItemPrice;

	_.each(barcodeOfPromotions, function(promotionBarcode) {
		if (promotionBarcode == itemBarcode && itemCount[itemBarcode] > 2) {
			promotedItems[itemBarcode] = 1;
			saveMoney += nowItemPrice*promotedItems[itemBarcode];
			sumMoney = (nowItemCount-1)*nowItemPrice;
		}
	});
	return sumMoney;
}

function printPromotion() {
	outputText += promotionSentence;
	_.each(promotedItems, function(promotedItem, itemBarcode) {
		outputText += "名称：" + standardItems[itemBarcode].name + "，数量：" +
			promotedItem + standardItems[itemBarcode].unit + "\n";
	});
}

function printTotalCount() {
	outputText += "总计：" + totalMoney.toFixed(2) + "(" + moneyUnit + ")\n";
	outputText += "节省：" + saveMoney.toFixed(2) + "(" + moneyUnit + ")\n";
} 