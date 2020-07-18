/* eslint no-console: [ 'error', { allow: [ 'error' ] } ] */
import { dispatch } from '@wordpress/data';

/**
 * Set block renderer config
 * Set block renderer config is for defining UI behavior for the block
 *
 * @param {string} type     Block unique name.
 * @param {Object} config Block Configuration.
 *
 */
export const setBlockRendererConfig = ( type, config ) => {
	config = {
		type,
		...config,
	};
	if ( typeof type !== 'string' ) {
		console.error( 'Block types must be strings.' );
		return;
	}
	if ( ! config.getRawValue ) config.getRawValue = ( val ) => val;
	dispatch( 'quillForms/blocks' ).addBlockRendererConfig( config );
};
