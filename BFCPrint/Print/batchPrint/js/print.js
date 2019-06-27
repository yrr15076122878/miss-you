/*! Print page JS */

function Preview() {
    if (document.all.eprint.defaultPrinterName.length == 0) {
        alert("请先安装打印机，再执行此功能！");
        return;
    }

    document.all.eprint.Preview();
}

function Print() {
    if (document.all.eprint.defaultPrinterName.length == 0) {
        alert("请先安装打印机，再执行此功能！");
        return;
    }

    document.all.eprint.InitPrint();
    //document.all.eprint.SetMarginMeasure(2);//1mm是default, 2 inch
    //document.all.eprint.marginTop=1.11;
    //document.all.eprint.marginLeft=1;
    //document.all.eprint.marginRight=1;
    //document.all.eprint.marginBottom=1;

    document.all.eprint.Print();
}

function DirectPrint() {
    if (document.all.eprint.defaultPrinterName.length == 0) {
        alert("请先安装打印机，再执行此功能！");
        return;
    }

    document.all.eprint.Print(true); //不出打印提示框，直接打印
}

function setUserPaperSize() {
    if (document.all.eprint.defaultPrinterName.length == 0) {
        alert("请先安装打印机，再执行此功能！");
        return;
    }

    document.all.eprint.InitPrint();
    document.all.eprint.SetMarginMeasure(1); //1 mm是default, 2 inch
    document.all.eprint.paperSize = "US Std Fanfold"; //设置值与打印机的自定义纸的名称相同
    document.all.eprint.pageWidth = 100;
    document.all.eprint.pageHeight = 90;
    alert("已设置纸的宽为100mm,高为90mm！");
    document.all.eprint.Preview();

}