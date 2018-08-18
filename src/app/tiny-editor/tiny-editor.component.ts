import { Component, AfterViewInit, EventEmitter, OnDestroy, Input, Output } from '@angular/core';
import 'tinymce';
import 'tinymce/themes/modern';
import 'tinymce/plugins/table';
import 'tinymce/plugins/link';

declare var tinymce: any;

@Component({
  selector: 'app-tiny-editor',
  template: `<textarea id="{{elementId}}"></textarea>`
})
export class TinyEditorComponent implements AfterViewInit, OnDestroy {
  @Input() elementId: String;
  @Output() onEditorContentChange = new EventEmitter();

  editor;

  ngAfterViewInit() {

   tinymce.init({
    selector: '#' + this.elementId,
    theme: 'modern',
    width: 400,
    height: 300,
    plugins: [
      'advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker',
      'searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking',
      'save table contextmenu directionality emoticons template paste textcolor'
    ],
    content_css: 'css/content.css',
    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor emoticons',
    setup: editor => {
  			this.editor = editor;
  			editor.on('keyup change', () => {
  				const content = editor.getContent();
  				this.onEditorContentChange.emit(content);
  			});
  		}
  });
   /*
  	tinymce.init({
  		selector: '#' + this.elementId,
  		//plugins: ['link','table'],
  		plugins: 'advlist autolink link image lists charmap prtin preview',
  		menubar: 'file edit view'
  		skin_url: '../assets/skins/lightgray',
  		setup: editor => {
  			this.editor = editor;
  			editor.on('keyup change', () => {
  				const content = editor.getContent();
  				this.onEditorContentChange.emit(content);
  			});
  		}
  	});
  	*/
  }

  ngOnDestroy() {
  	tinymce.remove(this.editor);
  }
}
