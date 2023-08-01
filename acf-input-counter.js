// (function ($) {
//         // $(document).ready(function () {
//         //         /**
//         //          * Sync conters with qtranslatex language switchers.
//         //          */
//         //         $('body').on('click', '.qtranxs-lang-switch', function () {
//         //                 var parent = $('.multi-language-field'), language = $(this).attr('lang');
//         //                 // this is for qtranslate_text and qtranslate_textarea fields
//         //                 parent.find('input[data-language="' + language + '"], textarea[data-language="' + language + '"]').trigger('input');
//         //                 // this is for qtranslate_wysiwyg field
//         //                 parent.find('textarea[name$="[' + language + ']"]').trigger('change');
//         //         });
//         // });
//         /**
//          * default acf.fields.wysiwyg initialization replace the php generated html whit a new one with nue uniq id
//          * the above mentioned replacement prevent qtranslate content hook removal fron related textarea
//          * (because the new id didn't match the id stored in qtranslate initial configuration)
//          * 
//          * solution: redefine acf.fields.wysiwyg.initialize function where replacement lines are simply commented out to prevent replacement
//          * all works fine with wysiwyg inside a repeater field
//          * (more investigations will be needed to check how it works with clone field or flexible content field)
//          * 
//          */
//         // acf.fields.wysiwyg.initialize = function () {
//         //         // bail early if delay
//         //         if (this.$el.hasClass('delay'))
//         //                 return;
//         //         // bail early if no tinyMCEPreInit (needed by both tinymce and quicktags)
//         //         if (typeof tinyMCEPreInit === 'undefined')
//         //                 return;
//         //         // generate new id
//         //         var old_id = this.o.id,
//         //                 new_id = acf.get_uniqid('acf-editor-'),
//         //                 html = this.$el.outerHTML();
//         //         // replace
//         //         html = acf.str_replace(old_id, new_id, html);
//         //         /**
//         //          * swapping of this.$el and change of this.o.id needs to be prevented to remove qTranslate contentHook for default acf wysiwyg field textarea
//         //          * so we need to comment it out
//         //          */
//         //         // swap
//         //         //this.$el.replaceWith(html);
//         //         // update id
//         //         //this.o.id = new_id
//         //         // initialize
//         //         this.initialize_tinymce();
//         //         this.initialize_quicktags();
//         // }
//         // Remove content hooks from standard wysiwyg field
//         acf.add_filter('wysiwyg_tinymce_settings', function (mceInit, id) {
//                 if (typeof qTranslateConfig == 'object') {
//                         qTranslateConfig.qtx.removeContentHook(mceInit);
//                         $('#' + id).removeClass('qtranxs-translatable');
//                 }
//                 // do something to mceInit
//                 mceInit.setup = function (ed) {
//                         /**
//                          * check counter status before insert new char
//                          * on maxlength reached allows backspace, delete and copy/cut keybord shortcuts
//                          */
//                         ed.on('keyDown', function (e) {
//                                 // console.log(e);
//                                 var $max = $(ed.getElement()).attr("maxlength");
//                                 if (typeof ($max) == 'undefined') {
//                                         return;
//                                 }
//                                 var $value = ed.getContent();
//                                 /**
//                                  * remove html tags with regexpr to be sure the length is calculated only by visible characters
//                                  */
//                                 var $length = acf.decode($value.replace(/<\/?[^>]+(>|$)/g, "")).length;
//                                 if ($length >= $max
//                                         && e.keyCode != 8 // backspace
//                                         && e.keyCode != 46 // delete
//                                         && (e.ctrlKey && e.keyCode != 88) // ctrl+x
//                                         && (e.ctrlKey && e.keyCode != 67) // ctrl+c
//                                         ) {
//                                         tinymce.dom.Event.cancel(e);
//                                 }
//                         });
//                         /**
//                          * update counter
//                          */
//                         ed.on('keyUp', function (e) {
//                                 var $max = $(ed.getElement()).attr("maxlength");
//                                 if (typeof ($max) == 'undefined') {
//                                         return;
//                                 }
//                                 var $value = ed.getContent();
//                                 /**
//                                  * remove html tags with regexpr to be sure the length is calculated only by visible characters
//                                  */
//                                 var $length = acf.decode($value.replace(/<\/?[^>]+(>|$)/g, "")).length;
//                                 $(ed.getElement()).closest('.acf-input').find('.count').text($length);
//                         });
//                 };
//                 // return
//                 return mceInit;
//         });
//         acf.change_count_text = function (e) {
//                 var $max = e.$el.attr('maxlength');
//                 if (typeof ($max) == 'undefined' || e.$el.closest('.acf-input').find('.count').length == 0) {
//                         return;
//                 }
//                 var $value = e.$el.val();
//                 var $length = $value.length;
//                 e.$el.closest('.acf-input').find('.count').text($length);
//         }
//         acf.change_count_textarea = function (e) {
//                 var $max = e.$el.attr('maxlength');
//                 if (typeof ($max) == 'undefined') {
//                         return;
//                 }
//                 var $value = e.$el.val();
//                 var $length = $value.length;
//                 e.$el.closest('.acf-input').find('.count').text($length);
//         }
//         acf.refresh_hidden = function (e) {
//                 var self = $(e.$field);
//                 self.$el = self.find('.acf-input');
//                 /**
//                  * if qTranslete is enabled get the active language
//                  */
//                 var active_lang = typeof qTranslateConfig == 'object' ? qTranslateConfig.activeLanguage : false;
//                 switch (e.type) {
//                         case 'text':
//                         case 'qtranslate_text':
//                                 /**
//                                  * this is needed if the field is hidden by tab layout
//                                  */
//                                 active_lang ? self.$el.find('input[data-language="' + active_lang + '"]').trigger('input') : self.$el.find('input').trigger('input');
//                                 break;
//                         case 'textarea':
//                         case 'qtranslate_textarea':
//                                 /**
//                                  * this is needed if the field is hidden by tab layout
//                                  */
//                                 active_lang ? self.$el.find('textarea[data-language="' + active_lang + '"]').trigger('input') : self.$el.find('textarea').trigger('input');
//                                 break;
//                 }
//         }
//         acf.check_maxlength = function (e) {
//                 var self = $(e.$field);
//                 // get element
//                 self.$el = self.find('.acf-input');
//                 /**
//                  * timeout is needed to wait for tinymce/quicktags activation
//                  */
//                 setTimeout(function () {
//                         self.$textarea = self.$el.find('textarea');
//                         if (!self.$el.attr('maxlength')) {
//                                 var ajax_data = acf.prepare_for_ajax({
//                                         action: 'get_maxlength',
//                                         field_key: acf.get_data(self.$el.parent(), 'key')
//                                 });
//                                 // get maxlength 
//                                 $.ajax({
//                                         url: acf.get('ajaxurl'),
//                                         dataType: 'json',
//                                         type: 'post',
//                                         data: ajax_data,
//                                         success: function (json) {
//                                                 if (json.success) {
//                                                         //console.info(json, self.$el);
//                                                         self.$textarea.attr('maxlength', json.data.maxlength);
//                                                 } else {
//                                                         console.warn(json, self.$el);
//                                                 }
//                                         },
//                                         complete: function () {
//                                                 /**
//                                                  * if qTranslete is enabled get the active language
//                                                  */
//                                                 var active_lang = typeof qTranslateConfig == 'object' ? qTranslateConfig.activeLanguage : false;
//                                                 /**
//                                                  * this is needed if the field is hidden by tab layout
//                                                  */
//                                                 active_lang ? self.$el.find('textarea[name$="[' + active_lang + ']"]').trigger('change') : self.$textarea.trigger('change');
//                                         }
//                                 });
//                         }
//                 }, 1);
//         }
//         acf.fields.text_counter = acf.field.extend({
//                 type: 'text',
//                 actions: {
//                         'load': 'refresh_hidden',
//                 },
//                 events: {
//                         'input input': 'change_count',
//                         'focus input': 'change_count',
//                 },
//                 change_count: function (e) {
//                         acf.change_count_text(e)
//                 },
//                 refresh_hidden: function () {
//                         acf.refresh_hidden(this)
//                 }
//         });
//         acf.fields.qtranslate_text_counter = acf.field.extend({
//                 type: 'qtranslate_text',
//                 actions: {
//                         'load': 'refresh_hidden',
//                 },
//                 events: {
//                         'input input': 'change_count',
//                         'focus input': 'change_count',
//                 },
//                 change_count: function (e) {
//                         acf.change_count_text(e)
//                 },
//                 refresh_hidden: function () {
//                         acf.refresh_hidden(this)
//                 }
//         });
//         acf.fields.textarea_counter = acf.field.extend({
//                 type: 'textarea',
//                 actions: {
//                         'load': 'refresh_hidden',
//                 },
//                 events: {
//                         'input textarea': 'change_count',
//                         'focus textarea': 'change_count',
//                 },
//                 change_count: function (e) {
//                         acf.change_count_textarea(e)
//                 },
//                 refresh_hidden: function () {
//                         acf.refresh_hidden(this)
//                 }
//         });
//         acf.fields.qtranslate_textarea_counter = acf.field.extend({
//                 type: 'qtranslate_textarea',
//                 actions: {
//                         'load': 'refresh_hidden',
//                 },
//                 events: {
//                         'input textarea': 'change_count',
//                         'focus textarea': 'change_count',
//                 },
//                 change_count: function (e) {
//                         acf.change_count_textarea(e)
//                 },
//                 refresh_hidden: function () {
//                         acf.refresh_hidden(this)
//                 }
//         });
//         acf.fields.wysiwyg_counter = acf.field.extend({
//                 type: 'wysiwyg',
//                 actions: {
//                         'load': 'check_maxlength',
//                 },
//                 events: {
//                         'input textarea': 'change_count',
//                         'focus textarea': 'change_count',
//                         'change .wp-editor-area': 'change_count',
//                         'click .wp-media-buttons button': 'check_editor',
//                 },
//                 check_maxlength: function () {
//                         acf.check_maxlength(this)
//                 },
//                 change_count: function (e) {
//                         acf.change_count_textarea(e)
//                 },
//                 check_editor: function (e) {
//                         /**
//                          * force triggering "change" event on tinymce/quicktags switching
//                          */
//                         $(tinyMCE.activeEditor.targetElm).trigger('change').focus();
//                 }
//         });
//         // acf.fields.qtranslate_wysiwyg_counter = acf.field.extend({
//         //         type: 'qtranslate_wysiwyg',
//         //         actions: {
//         //                 'load': 'check_maxlength',
//         //         },
//         //         events: {
//         //                 'input textarea': 'change_count',
//         //                 'focus textarea': 'change_count',
//         //                 'change .qtx-wp-editor-area': 'change_count',
//         //                 'click .wp-editor-tabs button, a.wp-switch-editor': 'check_editor',
//         //         },
//         //         check_maxlength: function () {
//         //                 acf.check_maxlength(this)
//         //         },
//         //         change_count: function (e) {
//         //                 acf.change_count_textarea(e)
//         //         },
//         //         check_editor: function (e) {
//         //                 /**
//         //                  * timeout is needed to wait for tinymce/quicktags switching
//         //                  */
//         //                 setTimeout(function () {
//         //                         var tinymceActive = (typeof tinyMCE !== 'undefined') && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden();
//         //                         /* Check if TinyMCE is active */
//         //                         if (tinymceActive) {
//         //                                 var id = $(tinyMCE.activeEditor.container.closest('.multi-language-field')).find('.acf-editor-wrap.current-language textarea').attr('id');
//         //                                 if (tinymce.get(id))
//         //                                         tinymce.get(id).fire('keyUp');
//         //                         } else {
//         //                                 $('.qtx-wp-editor-area').trigger('change').focus();
//         //                         }
//         //                 }, 100);
//         //         }
//         // });
// })(jQuery);

// (function($) {
// 	acf.fields.text_counter = acf.field.extend({
// 		type: 'text',	
// 		events: {
// 			'input input': 'change_count',
// 		},
// 		change_count: function(e){
// 			var $max = e.$el.attr('maxlength');
// 			if (typeof($max) == 'undefined' || e.$el.closest('.acf-input').find('.count').length == 0) {
// 				return;
// 			}
// 			var $value = e.$el.val().replace(/<[^>]+>/g, '');
// 			var $length = $value.length;
// 			e.$el.closest('.acf-input').find('.count').text($length);
// 		},
// 	});
// })(jQuery);
// (function($) {
// 	acf.fields.textarea_counter = acf.field.extend({
// 		type: 'textarea',
// 		action: {
// 				'load': 'change_count',
// 		},
// 		events: {
// 			'input textarea': 'change_count',
// 		},
// 		change_count: function(e){
// 			var $max = e.$el.attr('maxlength');
// 			// console.log($max);
// 			if (typeof($max) == 'undefined') {
// 				return;
// 			}
// 			var $value = e.$el.val().replace(/<[^>]+>/g, '');
// 			var $length = $value.length;
// 			console.log($value);
// 			e.$el.closest('.acf-input').find('.count').text($length);
// 		},	
// 	});
// })(jQuery);
// (function($) {
//         acf.fields.wysiwyg_counter = acf.field.extend({
//                 type: 'wysiwyg',
// 				actions: {
// 					'load': 'add_count',			
// 				},
//                 // actions: {
//                 //         'load': 'check_maxlength',
//                 // },
//                 events: {
// 					'change .mce-edit-area': 'change_count',
// 					'keydown .mce-edit-area': 'change_count',
// 					'keyup .mce-edit-area': 'change_count',
// 					'keypress .mce-edit-area': 'change_count',
// 					'blur .mce-edit-area': 'change_count',
// 					'focus .mce-edit-area': 'change_count',
//                 },
//                 // check_maxlength: function () {
//                 //         acf.check_maxlength(this)
//                 // },
// 				add_count: function (e) {
// 					console.log(e.$el);
// 					e.$el.closest('.acf-input').append('<div class="acfcounter" style="background-color: #f7f7f7; color: #444; padding: 2px 10px; font-size: 12px; border: 1px solid #e5e5e5;"><span class="words" style="font-size: 12px; padding-right: 30px;"></span><span class="chars" style="font-size: 12px;"></span><span class="maxtext" style="font-size: 12px;"></span></div>');
// 				},
//                 change_count: function (e) {
// 					var max = e.$el.next().find('.maxcount').text(); // $('#wp-'+id+'-wrap').next().find('.maxcount').text();
// 					// console.log(parseInt(max));
// 					max = parseInt(max);
// 					var value =  e.$el.val(); //$('#'+id).val();
// 					var wordCount = (value.length == 0) ? 0 : value.trim().replace(/\s+/gi, ' ').split(' ').length;
// 					var totalChars = value.replace(/(<([^>]+)>)/ig,"").length;					
// 					e.$el.find('.mce-statusbar .acfcounter .words').html('Words: '+wordCount);
// 					e.$el.find('.mce-statusbar .acfcounter .chars').html('Characters: '+totalChars);				
// 					// $('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .words').html('Words: '+wordCount);
// 					// $('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .chars').html('Characters: '+totalChars);
// 					if ( !isNaN(max) && totalChars < max) {
// 						e.$el.find('.mce-statusbar .acfcounter .maxtext').html(' of <span style="font-weight:bold; font-size: 12px;">'+max+'</span>');
// 						// $('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .maxtext').html(' of <span style="font-weight:bold; font-size: 12px;">'+max+'</span>');
// 					}
// 					// else
// 					// 	$('#wp-'+id+'-editor-container .mce-statusbar .acfcounter').removeClass('max');
//                     //     var $max = e.$el.attr('maxlength');
//                     //     if (typeof($max) == 'undefined') {
// 					// 		return;
// 					// 	}
//                     //     // acf.change_count_textarea(e)
//                     //     var $value = e.$el.val().replace(/<[^>]+>/g, '');
// 					// 	console.log($value);
// 					// 	var $length = $value.length;
// 					// e.$el.closest('.acf-input').find('.count').text($length);
//                 },
//                 check_editor: function (e) {
//                         /**
//                          * force triggering "change" event on tinymce/quicktags switching
//                          */
//                         $(tinyMCE.activeEditor.targetElm).trigger('change').focus();
//                 }
//         });
// })(jQuery);

(function($) {
	
	acf.add_action('prepare_field/type=textarea', function( field ){
		// console.log(field);
		field.find('.acf-input').append('<div class="acfcounter" style="background-color: #f7f7f7; color: #444; padding: 2px 10px; font-size: 12px; border: 1px solid #e5e5e5;"><span class="words" style="font-size: 12px; padding-right: 30px;"></span><span class="chars" style="font-size: 12px;"></span><span class="maxtext" style="font-size: 12px;"></span></div>');
		const counter = function() {
			var max = field.find('textarea').attr('maxlength');
			// console.log(max);
			max = parseInt(max);
			var value = field.find('textarea').val();
			// console.log(value);
			var wordCount = (value.length == 0) ? 0 : value.trim().replace(/\s+/gi, ' ').split(' ').length;
			var totalChars = value.replace(/(<([^>]+)>)/ig,"").length;
				
			field.find('.acfcounter .words').html('Words: '+wordCount);
			field.find('.acfcounter .chars').html('Characters: '+totalChars);

			if ( !isNaN(max) && totalChars < max) {
				field.find('.acfcounter .maxtext').html(' of <span style="font-weight:bold; font-size: 12px;">'+max+'</span>');
			}
		};

		counter();					
		field.change(counter);
		field.keydown(counter);
		field.keypress(counter);
		field.keyup(counter);
		field.blur(counter);
		field.focus(counter);
		
	});
	
})(jQuery);

(function($) {
	
	acf.add_action('wysiwyg_tinymce_init', function( ed, id, mceInit, $field ){
		$('#wp-'+id+'-editor-container .mce-statusbar').append('<div class="acfcounter" style="background-color: #f7f7f7; color: #444; padding: 2px 10px; font-size: 12px; border-top: 1px solid #e5e5e5;"><span class="words" style="font-size: 12px; padding-right: 30px;"></span><span class="chars" style="font-size: 12px;"></span><span class="maxtext" style="font-size: 12px;"></span></div>');

		const counter = function() {
			var max = $('#wp-'+id+'-wrap').next().find('.maxcount').text();
			// console.log(parseInt(max));
			max = parseInt(max);
			var value = $('#'+id).val();
			var wordCount = (value.length == 0) ? 0 : value.trim().replace(/\s+/gi, ' ').split(' ').length;
			var totalChars = value.replace(/(<([^>]+)>)/ig,"").length;
				
			$('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .words').html('Words: '+wordCount);
			$('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .chars').html('Characters: '+totalChars);

			if ( !isNaN(max) && totalChars < max) {
				$('#wp-'+id+'-editor-container .mce-statusbar .acfcounter .maxtext').html(' of <span style="font-weight:bold; font-size: 12px;">'+max+'</span>');
			}
		};

		counter();					
		$('#'+id).change(counter);
		$('#'+id).keydown(counter);
		$('#'+id).keypress(counter);
		$('#'+id).keyup(counter);
		$('#'+id).blur(counter);
		$('#'+id).focus(counter);
		
	});
	
})(jQuery);

// tinymce.add('charactercount', function (editor) {
// 	var _self = this;
  
// 	function update() {
// 	  editor.theme.panel.find('#charactercount').text(['Characters: {0}', _self.getCount()]);
// 	}
  
// 	editor.on('init', function () {
// 	  var statusbar = editor.theme.panel && editor.theme.panel.find('#statusbar')[0];
  
// 	  if (statusbar) {
// 		window.setTimeout(function () {
// 		  statusbar.insert({
// 			type: 'label',
// 			name: 'charactercount',
// 			text: ['Characters: {0}', _self.getCount()],
// 			classes: 'charactercount',
// 			disabled: editor.settings.readonly
// 		  }, 0);
  
// 		  editor.on('setcontent beforeaddundo keyup', update);
// 		}, 0);
// 	  }
// 	});
  
// 	_self.getCount = function () {
// 	  var tx = editor.getContent({ format: 'raw' });
// 	  var decoded = decodeHtml(tx);
// 	  var decodedStripped = decoded.replace(/(<([^>]+)>)/ig, '');
// 	  var tc = decodedStripped.length;
// 	  return tc;
// 	};
  
// 	function decodeHtml(html) {
// 	  var txt = document.createElement('textarea');
// 	  txt.innerHTML = html;
// 	  return txt.value;
// 	}
//   });

//   tinymce.init({
// 	plugins: 'charactercount',
// 	elementpath: false
//   });
