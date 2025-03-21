<?php
/**
 * Main class: class QuillForms
 *
 * @since 1.0.0
 * @package QuillForms
 */

namespace QuillForms;

use QuillForms\Admin\Admin;
use QuillForms\Admin\Admin_Loader;
use QuillForms\Log_Handlers\Log_Handler_DB;
use QuillForms\Render\Form_Renderer;
use QuillForms\REST_API\REST_API;
use QuillForms\Site\Site;
use QuillForms\System_Status\System_Status;

/**
 * QuillForms Main Class.
 * The main class that's responsible for loading all dependencies
 *
 * @since 1.0.0
 *
 * @property-read Tasks $tasks
 */
final class QuillForms {

	/**
	 * Tasks
	 *
	 * @since 1.6.0
	 *
	 * @var Tasks
	 */
	private $tasks;

	/**
	 * Class Instance.
	 *
	 * @since 1.0.0
	 *
	 * @var QuillForms
	 */
	private static $instance;

	/**
	 * QuillForms Instance.
	 *
	 * Instantiates or reuses an instance of QuillForms.
	 *
	 * @since 1.0.0
	 * @static
	 *
	 * @return self - Single instance
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 */
	private function __construct() {
		$this->load_dependencies();
		$this->init_objects();
		$this->init_hooks();
	}

	/**
	 * Get readonly property
	 *
	 * @param string $name Property name.
	 * @return mixed
	 */
	public function __get( $name ) {
		return $this->$name;
	}

	/**
	 * Isset for readonly property
	 *
	 * @param string $name Property name.
	 * @return boolean
	 */
	public function __isset( $name ) {
		return isset( $this->$name );
	}

	/**
	 * Dependencies Loader.
	 *
	 * @since 1.0.0
	 */
	private function load_dependencies() {
		// functions.
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/functions.php';

		// blocks.
		foreach ( glob( QUILLFORMS_PLUGIN_DIR . 'includes/blocks/**/*.php' ) as $block ) {
			require_once $block;
		}

		// client assets.
		require_once QUILLFORMS_PLUGIN_DIR . 'lib/client-assets.php';
	}

	/**
	 * Initialize instances from classes loaded.
	 *
	 * @since 1.0.0
	 */
	private function init_objects() {
		$this->tasks = new Tasks( 'quillforms' );

		Admin_Loader::instance();
		Install::init();
		Merge_Tags::instance();
		Form_Renderer::instance();
		Form_Submission::instance();
		Admin::instance();
		REST_API::instance();
		Site::instance();
	}

	/**
	 * Initialize hooks
	 *
	 * @since 1.0.0
	 */
	private function init_hooks() {
		add_filter( 'quillforms_register_log_handlers', array( $this, 'register_log_handlers' ) );
		add_action( 'init', array( Capabilities::class, 'assign_capabilities_for_user_roles' ) );
		add_action( 'init', array( Core::class, 'register_quillforms_post_type' ) );
		add_action( 'init', array( $this, 'register_rest_fields' ) );
	}

	/**
	 * Register log handlers
	 *
	 * @param array $handlers Handlers array to filter.
	 * @return array
	 */
	public function register_log_handlers( $handlers ) {
		$handlers[] = new Log_Handler_DB();
		return $handlers;
	}

	/**
	 * Register REST fields.
	 *
	 * @return void
	 */
	public function register_rest_fields() {
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/blocks.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/messages.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/notifications.php';
		require_once QUILLFORMS_PLUGIN_DIR . 'includes/rest-fields/theme.php';
	}
}
